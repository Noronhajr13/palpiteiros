🎯 Palpiteiros

🎯 Sobre o Projeto

  - O Palpiteiros V2 é um aplicativo web completo para a gestão de bolões esportivos. Desenvolvido com uma abordagem "frontend-first", o projeto começou com um MVP (Produto Mínimo Viável) funcional e evoluiu para um produto robusto e visualmente impressionante, com um foco especial em uma experiência de usuário (UX) excepcional. Atualmente na Fase 8, o próximo passo é a integração do backend com o Supabase.

✨ Destaques do Projeto

  - Frontend-First: A prioridade foi criar uma interface completa e funcional antes de integrar um backend.
  - UX/UI Premium: O design foi refinado com um Design System, microinterações, animações suaves e um Dark Mode completo.
  - Performance Otimizada: Melhorias de build, otimização de imagens e resolução de warnings garantem um desempenho rápido e estável.
  - Recursos Avançados: Implementação de funcionalidades como breadcrumbs, Mobile Experience completo, estatísticas profissionais e um sistema de perfil de usuário robusto.

🚀 Status Atual

  Versão: V2
  Status: ✅ FASE 7 CONCLUÍDA - Features Premium implementadas com sucesso!
  Próximo Passo: FASE 8 - INTEGRAÇÃO BACKEND (Supabase)

🛠️ Tecnologias e Ferramentas

  * Frontend
    - Framework: Next.js 15.5.0 (App Router)
    - Linguagem: React 19.1.0, TypeScript 5
    - Estilização: Tailwind CSS 4, shadcn/ui
    - Gerenciamento de Estado: Zustand
    - Validação de Formulários: React Hook Form + Zod
    - Notificações: Sonner
    - Ícones: Lucide React
    - Animações: Framer Motion
    - Gráficos: Recharts

  * Backend (Roadmap)
    - Backend as a Service (BaaS): Supabase
    - Banco de Dados: Supabase Database
    - Autenticação: Supabase Auth
    - Comunicação: API Routes Next.js, Real-time subscriptions

✅ Funcionalidades Implementadas

  * Funcionalidades Core (Fase 1)
    - Sistema de Autenticação: Login, Cadastro e proteção de rotas.
    - Gestão de Bolões: Criar, entrar, dashboard, e páginas de bolão.
    - Sistema de Palpites: Interface completa e sistema de pontuação.

  * Melhorias Visuais e de UX (Fases 2 a 7)
    - Design System Completo: Paleta de cores, tipografia, sombras e animações.
    - Páginas Renovadas: Landing page, dashboard, e páginas internas com layouts modernos.
    - Componentes Avançados: Toasts, Skeletons, Empty States, Modals e Progress Indicators.
    - Otimizações de Usabilidade: Breadcrumbs, Mobile Experience completo e animações com Framer Motion.
    - Features Premium: Dark Mode, Estatísticas Avançadas, Perfil do Usuário e Histórico Detalhado.

📁 Estrutura do Projeto

    palpiteiros-v2/
    ├── app/
    │   ├── page.tsx                   # ✅ Landing page
    │   ├── entrar/page.tsx            # ✅ Login
    │   ├── cadastrar/page.tsx         # ✅ Cadastro
    │   ├── meus-boloes/page.tsx       # ✅ Dashboard
    │   ├── criar-bolao/page.tsx       # ✅ Criar bolão
    │   ├── entrar-bolao/page.tsx      # ✅ Entrar em bolão
    │   └── bolao/[id]/
    │       ├── page.tsx               # ✅ Página do bolão
    │       ├── palpites/page.tsx      # ✅ Interface palpites
    │       └── ranking/page.tsx       # ✅ Rankings
    ├── lib/stores/
    │   ├── useAuthStore.ts            # ✅ Store autenticação
    │   └── useBolaoStore.ts           # ✅ Store bolões
    ├── components/ui/                 # ✅ shadcn/ui components
    └── lib/utils.ts                   # ✅ Utilitários


⚙️ Como Executar o Projeto

  * Instale as dependências:
    - npm install

  * Execute o servidor de desenvolvimento:
    - npm run dev

🤝 Conquistas e Próximos Passos
  ✅ Build Success: 10 rotas compilando perfeitamente
  ✅ Zero Bugs: Sistema 100% navegável
  ✅ MVP Completo: Todas as funcionalidades essenciais
  ✅ Frontend-First: Estratégia executada com sucesso

Este projeto está em desenvolvimento ativo. Sinta-se à vontade para contribuir, reportar bugs ou sugerir novas funcionalidades.