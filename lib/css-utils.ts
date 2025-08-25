/**
 * Utilitários de CSS customizáveis para toda aplicação
 * Centralizando padrões visuais que se repetem
 */

// Gradientes padronizados da aplicação
export const gradients = {
  // Gradientes principais
  primary: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
  primaryHover: "hover:bg-gradient-to-r hover:from-blue-600 hover:via-blue-700 hover:to-blue-800",
  
  // Gradientes de destaque
  accent: "bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600",
  accentHover: "hover:bg-gradient-to-r hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700",
  
  // Gradientes de sucesso
  success: "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600",
  successHover: "hover:bg-gradient-to-r hover:from-green-600 hover:via-green-700 hover:to-emerald-700",
  
  // Gradientes de fundo
  pageBackground: "bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
  cardBackground: "bg-white dark:bg-gray-800",
  
  // Gradientes de texto
  textGradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent",
  
  // Gradientes especiais
  glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
} as const

// Classes de sombra padronizadas
export const shadows = {
  card: "shadow-lg hover:shadow-xl transition-shadow duration-300",
  cardHover: "hover:shadow-2xl transition-shadow duration-300",
  button: "shadow-md hover:shadow-lg transition-shadow duration-200",
  modal: "shadow-2xl",
  floating: "shadow-xl border border-gray-200 dark:border-gray-700",
} as const

// Classes de texto responsivas
export const typography = {
  // Títulos
  h1: "text-3xl md:text-4xl lg:text-5xl font-bold",
  h2: "text-2xl md:text-3xl lg:text-4xl font-bold",
  h3: "text-xl md:text-2xl lg:text-3xl font-semibold",
  h4: "text-lg md:text-xl font-semibold",
  
  // Texto do corpo
  body: "text-base leading-relaxed",
  bodyLarge: "text-lg leading-relaxed",
  bodySmall: "text-sm",
  
  // Texto com cores semânticas
  muted: "text-gray-600 dark:text-gray-400",
  mutedSmall: "text-sm text-gray-500 dark:text-gray-500",
  
  // Gradientes de texto
  gradient: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent",
  gradientGold: "bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 bg-clip-text text-transparent",
} as const

// Classes de layout responsivo
export const layout = {
  // Containers
  container: "container mx-auto px-4 py-8 max-w-6xl",
  containerSmall: "container mx-auto px-4 py-6 max-w-4xl",
  
  // Grids responsivos
  gridCards: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  gridStats: "grid grid-cols-2 md:grid-cols-4 gap-4",
  
  // Flex layouts
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexColumn: "flex flex-col space-y-4",
  
  // Espaçamentos
  spacing: "space-y-6",
  spacingLarge: "space-y-8",
  spacingSmall: "space-y-4",
} as const

// Classes de animação
export const animations = {
  // Hover effects
  hoverScale: "hover:scale-105 transition-transform duration-200",
  hoverScaleSmall: "hover:scale-102 transition-transform duration-150",
  
  // Fade in
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom-4 duration-500",
  
  // Loading
  pulse: "animate-pulse",
  spin: "animate-spin",
  
  // Buttons
  buttonHover: "hover:scale-105 hover:shadow-lg transition-all duration-200",
} as const

// Classes de estado
export const states = {
  // Loading states
  skeleton: "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
  
  // Interactive states
  interactive: "cursor-pointer transition-all duration-200",
  disabled: "opacity-50 cursor-not-allowed",
  
  // Status colors
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
} as const

// Classes de componentes específicos
export const components = {
  // Cards
  card: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
  cardHover: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow",
  
  // Badges
  badge: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
  badgeSuccess: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  badgeError: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  badgeWarning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  badgeInfo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  
  // Inputs
  input: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  
  // Buttons
  buttonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  buttonSecondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
  buttonGhost: "hover:bg-accent hover:text-accent-foreground",
} as const

// Função helper para combinar classes
export function combineClasses(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Função para aplicar tema de cor baseado em uma string
export function getColorTheme(seed: string): string {
  const themes = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-blue-600", 
    "from-purple-500 to-pink-600",
    "from-yellow-500 to-orange-600",
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-red-600",
  ]
  
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return themes[Math.abs(hash) % themes.length]
}

export const cssUtils = {
  gradients,
  shadows,
  typography,
  layout,
  animations,
  states,
  components,
  combineClasses,
  getColorTheme
}
