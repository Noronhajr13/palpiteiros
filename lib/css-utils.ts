/**
 * 🎨 Design System Unificado - Dark Mode Moderno
 * Utilitários consistentes para toda aplicação
 */

// 🎨 Sistema de Cores Unificado
export const colors = {
  // Surfaces
  background: "bg-background",
  surface: "bg-surface hover:bg-surface-hover",
  card: "bg-card",
  
  // Text
  primary: "text-foreground",
  secondary: "text-muted-foreground", 
  subtle: "text-text-subtle",
  
  // Borders
  border: "border-border",
  borderStrong: "border-border-strong",
} as const

// 🌟 Sistema de Gradientes (Uso Seletivo)
export const gradients = {
  // Apenas para CTAs importantes e logos
  primary: "gradient-primary",
  text: "gradient-text",
  
  // Classes tradicionais para compatibilidade
  cta: "bg-gradient-to-r from-primary to-accent",
  ctaHover: "hover:from-primary-hover hover:to-accent-hover",
} as const

// 🎭 Sistema de Sombras Minimalistas
export const shadows = {
  card: "shadow-lg shadow-black/10",
  cardHover: "hover:shadow-xl hover:shadow-black/20 transition-shadow duration-300",
  button: "shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/20 transition-shadow duration-200",
  modal: "shadow-2xl shadow-black/30",
  floating: "shadow-xl shadow-black/20 border-border-strong",
} as const

// 🏗️ Sistema de Cards Unificado
export const cards = {
  base: "bg-card border-border rounded-xl shadow-lg",
  interactive: "bg-card border-border rounded-xl shadow-lg hover:shadow-xl hover:border-border-strong transition-all duration-200",
  surface: "bg-surface border-border rounded-lg",
  elevated: "bg-card border-border-strong rounded-xl shadow-xl",
} as const

// ✍️ Sistema de Tipografia Moderno
export const typography = {
  // Hierarchy
  h1: "text-3xl md:text-4xl lg:text-5xl font-bold text-foreground",
  h2: "text-2xl md:text-3xl lg:text-4xl font-bold text-foreground", 
  h3: "text-xl md:text-2xl lg:text-3xl font-semibold text-foreground",
  h4: "text-lg md:text-xl font-semibold text-foreground",
  
  // Body text
  body: "text-base leading-relaxed text-foreground",
  bodyLarge: "text-lg leading-relaxed text-foreground",
  bodySmall: "text-sm text-muted-foreground",
  
  // Semantic text
  muted: "text-muted-foreground",
  subtle: "text-text-subtle",
  
  // Special text (selective use)
  gradient: "gradient-text font-bold",
  accent: "text-primary font-semibold",
} as const

// 📐 Sistema de Layout Consistente
export const layout = {
  // Containers
  container: "container mx-auto px-4 py-8 max-w-6xl",
  containerSmall: "container mx-auto px-4 py-6 max-w-4xl",
  
  // Grids
  gridCards: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  gridStats: "grid grid-cols-2 md:grid-cols-4 gap-4",
  
  // Flex
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between", 
  flexColumn: "flex flex-col space-y-4",
  
  // Spacing
  spacing: "space-y-6",
  spacingLarge: "space-y-8",
  spacingSmall: "space-y-4",
} as const

// 🎭 Sistema de Animações Suaves
export const animations = {
  // Subtle interactions
  hover: "hover:scale-[1.02] transition-all duration-200",
  hoverButton: "hover:scale-[1.05] transition-all duration-150",
  
  // Smooth entrances
  fadeIn: "animate-in fade-in duration-500 ease-out",
  slideUp: "animate-in slide-in-from-bottom-4 duration-400 ease-out",
  
  // Loading states
  pulse: "animate-pulse",
  bounce: "animate-gentle-bounce",
} as const

// 🎯 Sistema de Botões Unificado
export const buttons = {
  primary: "bg-primary hover:bg-primary-hover text-primary-foreground shadow-button rounded-lg px-4 py-2 font-medium transition-all duration-200",
  secondary: "bg-surface hover:bg-surface-hover text-foreground border border-border shadow-button rounded-lg px-4 py-2 font-medium transition-all duration-200",
  accent: "bg-accent hover:bg-accent-hover text-accent-foreground shadow-button rounded-lg px-4 py-2 font-medium transition-all duration-200",
  success: "bg-success hover:bg-success/90 text-success-foreground shadow-button rounded-lg px-4 py-2 font-medium transition-all duration-200",
  destructive: "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-button rounded-lg px-4 py-2 font-medium transition-all duration-200",
} as const

// 🎨 Estados Semânticos
export const states = {
  // Loading states
  skeleton: "animate-pulse bg-surface rounded",
  
  // Interactive states
  interactive: "cursor-pointer transition-all duration-200",
  disabled: "opacity-50 cursor-not-allowed",
  
  // Status colors
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
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
