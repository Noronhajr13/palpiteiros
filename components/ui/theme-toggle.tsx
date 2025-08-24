"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette,
  Check,
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Toggle simples Dark/Light
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-9">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 text-yellow-600" />
      ) : (
        <Moon className="h-4 w-4 text-blue-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Dropdown completo com todas as opções
export function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm">
        <Palette className="h-4 w-4 mr-2" />
        Tema
        <ChevronDown className="h-3 w-3 ml-2" />
      </Button>
    )
  }

  const themes = [
    {
      name: "light",
      label: "Claro",
      icon: Sun,
      description: "Tema claro padrão"
    },
    {
      name: "dark", 
      label: "Escuro",
      icon: Moon,
      description: "Tema escuro moderno"
    },
    {
      name: "system",
      label: "Sistema", 
      icon: Monitor,
      description: "Seguir sistema operacional"
    }
  ]

  const currentTheme = themes.find(t => t.name === theme) || themes[0]
  const CurrentIcon = currentTheme.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden md:inline">{currentTheme.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = theme === themeOption.name
          
          return (
            <DropdownMenuItem
              key={themeOption.name}
              onClick={() => setTheme(themeOption.name)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-xs text-gray-500">
                    {themeOption.description}
                  </div>
                </div>
                {isActive && <Check className="h-4 w-4 text-blue-600" />}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Card com preview dos temas
interface ThemePreviewCardProps {
  themeName: string
  label: string
  description: string
  isActive: boolean
  onClick: () => void
}

export function ThemePreviewCard({ 
  themeName, 
  label, 
  description, 
  isActive, 
  onClick 
}: ThemePreviewCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg
        ${isActive 
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }
      `}
    >
      {/* Preview mockup */}
      <div className={`
        h-20 rounded mb-3 border overflow-hidden
        ${themeName === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
        }
      `}>
        <div className={`
          h-6 border-b flex items-center px-2 gap-1
          ${themeName === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <div className={`
            w-2 h-2 rounded-full
            ${themeName === 'dark' ? 'bg-red-400' : 'bg-red-500'}
          `} />
          <div className={`
            w-2 h-2 rounded-full
            ${themeName === 'dark' ? 'bg-yellow-400' : 'bg-yellow-500'}
          `} />
          <div className={`
            w-2 h-2 rounded-full
            ${themeName === 'dark' ? 'bg-green-400' : 'bg-green-500'}
          `} />
        </div>
        <div className="p-2 space-y-1">
          <div className={`
            h-2 rounded
            ${themeName === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}
          `} />
          <div className={`
            h-2 w-3/4 rounded
            ${themeName === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}
          `} />
          <div className={`
            h-2 w-1/2 rounded
            ${themeName === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}
          `} />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm">{label}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>

      {isActive && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  )
}

// Configurações avançadas de tema
export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const themeOptions = [
    {
      name: "light",
      label: "Modo Claro",
      description: "Interface clara e limpa, ideal para uso durante o dia"
    },
    {
      name: "dark",
      label: "Modo Escuro", 
      description: "Interface escura que reduz o cansaço visual à noite"
    },
    {
      name: "system",
      label: "Automático",
      description: "Segue automaticamente as configurações do seu dispositivo"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Aparência</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Escolha como o Palpiteiros deve aparecer para você.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themeOptions.map((themeOption) => (
          <ThemePreviewCard
            key={themeOption.name}
            themeName={themeOption.name}
            label={themeOption.label}
            description={themeOption.description}
            isActive={theme === themeOption.name}
            onClick={() => setTheme(themeOption.name)}
          />
        ))}
      </div>

      <div className="pt-4 border-t dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          💡 <strong>Dica:</strong> O modo automático muda automaticamente entre claro e escuro 
          baseado nas configurações do seu sistema operacional.
        </div>
      </div>
    </div>
  )
}