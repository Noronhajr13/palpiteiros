import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para proteger rotas
 * 
 * IMPORTANTE: Edge Runtime não suporta MongoDB/crypto
 * Por isso, verificamos apenas a presença do cookie de sessão do NextAuth
 * A validação real do JWT é feita pelo NextAuth automaticamente
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se existe cookie de sessão do NextAuth
  // NextAuth v5 usa cookies diferentes dependendo se é produção ou desenvolvimento
  const sessionToken = 
    request.cookies.get('authjs.session-token')?.value || // Produção
    request.cookies.get('__Secure-authjs.session-token')?.value // Produção HTTPS

  const isAuthenticated = !!sessionToken

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/entrar', '/cadastrar']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Rotas que requerem autenticação
  const protectedRoutes = [
    '/meus-boloes',
    '/criar-bolao',
    '/entrar-bolao',
    '/explorar-boloes',
    '/perfil',
    '/historico',
    '/estatisticas',
    '/bolao'
  ]
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Se não está autenticado e tenta acessar rota protegida
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/entrar', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se está autenticado e tenta acessar página de login/cadastro
  if (isAuthenticated && (pathname === '/entrar' || pathname === '/cadastrar')) {
    return NextResponse.redirect(new URL('/meus-boloes', request.url))
  }

  return NextResponse.next()
}

/**
 * Configuração de rotas onde o middleware será executado
 * Exclui rotas estáticas e APIs
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
