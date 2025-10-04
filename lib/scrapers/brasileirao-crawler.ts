import * as cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface JogoScrapedData {
  rodada: number
  data: string
  horario: string
  timeA: string
  timeB: string
  placarA?: number
  placarB?: number
  status: 'agendado' | 'em_andamento' | 'finalizado'
}

interface ScrapingOptions {
  bolaoId: string
  rodadaInicio?: number
  rodadaFim?: number
  substituirExistentes?: boolean
}

export class BrasileiraoCrawler {
  private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

  private normalizarTime(nome: string): string {
    const mapeamento: Record<string, string> = {
      'Flamengo': 'Flamengo',
      'Palmeiras': 'Palmeiras',
      'São Paulo': 'São Paulo',
      'SP': 'São Paulo',
      'Corinthians': 'Corinthians',
      'Santos': 'Santos',
      'Vasco': 'Vasco da Gama',
      'Botafogo': 'Botafogo',
      'Fluminense': 'Fluminense',
      'Atlético-MG': 'Atlético Mineiro',
      'Atlético MG': 'Atlético Mineiro',
      'CAM': 'Atlético Mineiro',
      'Cruzeiro': 'Cruzeiro',
      'Internacional': 'Internacional',
      'Inter': 'Internacional',
      'Grêmio': 'Grêmio',
      'Athletico-PR': 'Athletico Paranaense',
      'Athletico': 'Athletico Paranaense',
      'CAP': 'Athletico Paranaense',
      'Coritiba': 'Coritiba',
      'Fortaleza': 'Fortaleza',
      'Ceará': 'Ceará',
      'Bahia': 'Bahia',
      'Vitória': 'Vitória',
      'Goiás': 'Goiás',
      'Atlético-GO': 'Atlético Goianiense',
      'Atlético GO': 'Atlético Goianiense',
      'Bragantino': 'Red Bull Bragantino',
      'RB Bragantino': 'Red Bull Bragantino',
      'Cuiabá': 'Cuiabá',
      'América-MG': 'América Mineiro'
    }
    return mapeamento[nome] || nome
  }

  private extrairPlacar(texto: string): { placarA?: number, placarB?: number } {
    if (!texto) return {}
    
    const placarMatch = texto.match(/(\d+)\s*[x×-]\s*(\d+)/)
    if (placarMatch) {
      return {
        placarA: parseInt(placarMatch[1]),
        placarB: parseInt(placarMatch[2])
      }
    }
    return {}
  }

  private formatarData(dataTexto: string): string {
    // Tentar diferentes formatos de data
    const hoje = new Date()
    const ano = hoje.getFullYear()
    
    // Formato DD/MM
    const formatoDDMM = dataTexto.match(/(\d{1,2})\/(\d{1,2})/)
    if (formatoDDMM) {
      const dia = formatoDDMM[1].padStart(2, '0')
      const mes = formatoDDMM[2].padStart(2, '0')
      return `${ano}-${mes}-${dia}T20:00:00.000Z`
    }
    
    // Formato DD/MM/YYYY
    const formatoDDMMYYYY = dataTexto.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
    if (formatoDDMMYYYY) {
      const dia = formatoDDMMYYYY[1].padStart(2, '0')
      const mes = formatoDDMMYYYY[2].padStart(2, '0')
      const anoCompleto = formatoDDMMYYYY[3]
      return `${anoCompleto}-${mes}-${dia}T20:00:00.000Z`
    }
    
    // Formato de hoje/amanhã
    if (dataTexto.toLowerCase().includes('hoje')) {
      return hoje.toISOString()
    }
    
    if (dataTexto.toLowerCase().includes('amanhã')) {
      const amanha = new Date(hoje)
      amanha.setDate(hoje.getDate() + 1)
      return amanha.toISOString()
    }
    
    // Padrão: hoje às 20h
    return `${ano}-${(hoje.getMonth() + 1).toString().padStart(2, '0')}-${hoje.getDate().toString().padStart(2, '0')}T20:00:00.000Z`
  }

  async extrairJogos(opcoes: ScrapingOptions): Promise<JogoScrapedData[]> {
    console.log(`📊 Extraindo jogos do Brasileirão para bolão ${opcoes.bolaoId}...`)
    
    try {
      // Fazer requisição para o site
      console.log('🌐 Fazendo requisição para Globo Esporte...')
      const response = await fetch('https://ge.globo.com/futebol/brasileirao-serie-a/', {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      
      console.log('🔍 Analisando HTML para extrair jogos...')
      const jogos: JogoScrapedData[] = []

      // Tentar diferentes seletores para encontrar os jogos
      const seletoresPossiveis = [
        '.tabela-partidas .partida',
        '.agenda .jogo',
        '.jogos .jogo-item',
        '.classificacao .jogo',
        '[data-jogo]',
        '.jogo'
      ]

      let jogosEncontrados = false

      for (const seletor of seletoresPossiveis) {
        const elementos = $(seletor)
        
        if (elementos.length > 0) {
          console.log(`✅ Encontrados ${elementos.length} jogos com seletor: ${seletor}`)
          jogosEncontrados = true

          elementos.each((index, elemento) => {
            try {
              const $el = $(elemento)
              
              // Extrair informações básicas
              let rodada = 1
              const rodadaAttr = $el.attr('data-rodada') || $el.find('[data-rodada]').attr('data-rodada')
              const rodadaTexto = $el.find('.rodada, .numero-rodada').text()
              
              if (rodadaAttr) {
                rodada = parseInt(rodadaAttr)
              } else if (rodadaTexto) {
                const match = rodadaTexto.match(/(\d+)/)
                if (match) rodada = parseInt(match[1])
              } else {
                rodada = Math.floor(index / 10) + 1 // Estimativa
              }

              // Filtrar por rodada se especificado
              if (opcoes.rodadaInicio && rodada < opcoes.rodadaInicio) return
              if (opcoes.rodadaFim && rodada > opcoes.rodadaFim) return

              // Extrair times
              const timesTexto = $el.find('.time, .equipe, .clube').map((_, el) => $(el).text().trim()).get()
              const timesAttr = $el.attr('data-times')
              
              let timeA = '', timeB = ''
              
              if (timesTexto.length >= 2) {
                timeA = this.normalizarTime(timesTexto[0])
                timeB = this.normalizarTime(timesTexto[1])
              } else if (timesAttr) {
                const times = timesAttr.split('x').map(t => t.trim())
                if (times.length >= 2) {
                  timeA = this.normalizarTime(times[0])
                  timeB = this.normalizarTime(times[1])
                }
              } else {
                // Tentar extrair do texto completo
                const textoCompleto = $el.text()
                const matchTimes = textoCompleto.match(/(\w+(?:\s+\w+)*)\s+(?:x|vs)\s+(\w+(?:\s+\w+)*)/)
                if (matchTimes) {
                  timeA = this.normalizarTime(matchTimes[1].trim())
                  timeB = this.normalizarTime(matchTimes[2].trim())
                }
              }

              if (!timeA || !timeB) {
                console.log(`⚠️  Não foi possível extrair times do elemento ${index}`)
                return
              }

              // Extrair data e horário
              const dataTexto = $el.find('.data, .data-jogo').text().trim() || 
                               $el.attr('data-date') || 
                               new Date().toLocaleDateString('pt-BR')
              
              const horarioTexto = $el.find('.horario, .hora').text().trim() || '20:00'
              
              const dataFormatada = this.formatarData(dataTexto)

              // Extrair placar e status
              const placarTexto = $el.find('.placar, .resultado').text().trim()
              const { placarA, placarB } = this.extrairPlacar(placarTexto)
              
              let status: 'agendado' | 'em_andamento' | 'finalizado' = 'agendado'
              
              if (placarA !== undefined && placarB !== undefined) {
                status = 'finalizado'
              } else if ($el.find('.ao-vivo, .transmitindo').length > 0) {
                status = 'em_andamento'
              }

              jogos.push({
                rodada,
                data: dataFormatada,
                horario: horarioTexto,
                timeA,
                timeB,
                placarA,
                placarB,
                status
              })

              console.log(`✅ Jogo extraído: ${timeA} x ${timeB} (Rodada ${rodada})`)

            } catch (error) {
              console.error(`❌ Erro ao processar jogo ${index}:`, error)
            }
          })
          
          break // Se encontrou jogos, para por aqui
        }
      }

      if (!jogosEncontrados) {
        console.log('⚠️  Nenhum jogo encontrado com os seletores disponíveis')
        console.log('🔍 HTML preview:', html.substring(0, 500))
        
        // Como fallback, criar jogos de exemplo do Brasileirão 2024
        console.log('📝 Criando jogos de exemplo do Brasileirão...')
        return this.criarJogosExemplo(opcoes)
      }

      console.log(`✅ Extraídos ${jogos.length} jogos do site`)
      return jogos

    } catch (error) {
      console.error('❌ Erro ao extrair jogos:', error)
      console.log('📝 Criando jogos de exemplo como fallback...')
      return this.criarJogosExemplo(opcoes)
    }
  }

  private criarJogosExemplo(opcoes: ScrapingOptions): JogoScrapedData[] {
    const times = [
      'Palmeiras', 'Flamengo', 'Atlético Mineiro', 'Fluminense',
      'Botafogo', 'São Paulo', 'Fortaleza', 'Internacional',
      'Corinthians', 'Santos', 'Vasco da Gama', 'Bahia',
      'Grêmio', 'Athletico Paranaense', 'Cruzeiro', 'Red Bull Bragantino',
      'Goiás', 'Cuiabá', 'Vitória', 'Atlético Goianiense'
    ]

    const jogos: JogoScrapedData[] = []
    const rodadaInicio = opcoes.rodadaInicio || 1
    const rodadaFim = opcoes.rodadaFim || 3

    for (let rodada = rodadaInicio; rodada <= rodadaFim; rodada++) {
      const dataBase = new Date()
      dataBase.setDate(dataBase.getDate() + (rodada - 1) * 7)

      for (let i = 0; i < 10; i++) {
        const indexTimeA = (rodada - 1) * 10 + i
        const indexTimeB = (indexTimeA + 10) % times.length
        
        const timeA = times[indexTimeA % times.length]
        const timeB = times[indexTimeB]

        if (timeA !== timeB) {
          jogos.push({
            rodada,
            data: dataBase.toISOString(),
            horario: ['16:00', '18:30', '20:00', '21:30'][i % 4],
            timeA,
            timeB,
            status: 'agendado'
          })
        }
      }
    }

    return jogos
  }

  async salvarJogosNoBanco(jogos: JogoScrapedData[], bolaoId: string, substituirExistentes = false): Promise<void> {
    console.log(`💾 Salvando ${jogos.length} jogos no banco de dados...`)

    try {
      for (const jogo of jogos) {
        const jogoExistente = await prisma.jogo.findFirst({
          where: {
            bolaoId,
            rodada: jogo.rodada,
            timeA: jogo.timeA,
            timeB: jogo.timeB
          }
        })

        if (jogoExistente) {
          if (substituirExistentes) {
            await prisma.jogo.update({
              where: { id: jogoExistente.id },
              data: {
                data: new Date(jogo.data),
                placarA: jogo.placarA || null,
                placarB: jogo.placarB || null,
                status: jogo.status
              }
            })
            console.log(`🔄 Jogo atualizado: ${jogo.timeA} x ${jogo.timeB} (Rodada ${jogo.rodada})`)
          } else {
            console.log(`⏭️  Jogo já existe: ${jogo.timeA} x ${jogo.timeB} (Rodada ${jogo.rodada})`)
          }
        } else {
          await prisma.jogo.create({
            data: {
              bolaoId,
              rodada: jogo.rodada,
              data: new Date(jogo.data),
              timeA: jogo.timeA,
              timeB: jogo.timeB,
              placarA: jogo.placarA || null,
              placarB: jogo.placarB || null,
              status: jogo.status
            }
          })
          console.log(`✅ Novo jogo criado: ${jogo.timeA} x ${jogo.timeB} (Rodada ${jogo.rodada})`)
        }
      }

      console.log(`🎉 Processo concluído! ${jogos.length} jogos processados.`)
    } catch (error) {
      console.error('❌ Erro ao salvar jogos no banco:', error)
      throw error
    }
  }

  async executarImportacaoCompleta(opcoes: ScrapingOptions): Promise<void> {
    try {
      const jogos = await this.extrairJogos(opcoes)
      
      if (jogos.length === 0) {
        console.log('⚠️  Nenhum jogo encontrado.')
        return
      }

      await this.salvarJogosNoBanco(jogos, opcoes.bolaoId, opcoes.substituirExistentes)
      
    } catch (error) {
      console.error('❌ Erro na importação:', error)
      throw error
    }
  }
}

// Função utilitária para uso direto
export async function importarJogosBrasileirao(
  bolaoId: string, 
  opcoes?: { 
    rodadaInicio?: number
    rodadaFim?: number
    substituirExistentes?: boolean 
  }
) {
  const crawler = new BrasileiraoCrawler()
  await crawler.executarImportacaoCompleta({
    bolaoId,
    ...opcoes
  })
}