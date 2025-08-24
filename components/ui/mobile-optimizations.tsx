"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Menu, 
  X, 
  Home, 
  Plus, 
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react"

// Hook para detectar dispositivos mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile
}

// Menu mobile expandível
interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function MobileMenu({ isOpen, onToggle, children }: MobileMenuProps) {
  return (
    <>
      {/* Botão toggle mobile */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="md:hidden p-2 hover:bg-blue-50"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Menu mobile overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={onToggle}
          />
          <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 md:hidden border-b">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Menu</h3>
                <Button variant="ghost" size="sm" onClick={onToggle}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {children}
            </div>
          </div>
        </>
      )}
    </>
  )
}

// Links de navegação mobile
interface MobileNavLinksProps {
  currentPath?: string
  onLinkClick?: () => void
}

export function MobileNavLinks({ currentPath, onLinkClick }: MobileNavLinksProps) {
  const links = [
    { href: '/meus-boloes', label: 'Meus Bolões', icon: Home },
    { href: '/criar-bolao', label: 'Criar Bolão', icon: Plus },
    { href: '/entrar-bolao', label: 'Entrar em Bolão', icon: Users }
  ]

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = currentPath === link.href
        
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

// Cards responsivos para mobile
interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  mobileSize?: 'compact' | 'normal' | 'expanded'
}

export function ResponsiveCard({ 
  children, 
  className = '', 
  mobileSize = 'normal' 
}: ResponsiveCardProps) {
  const mobileClasses = {
    compact: 'p-3 text-sm',
    normal: 'p-4',
    expanded: 'p-6'
  }

  return (
    <Card className={`
      ${className} 
      ${mobileClasses[mobileSize]} 
      md:p-6
    `}>
      {children}
    </Card>
  )
}

// Grid responsivo otimizado para mobile
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    mobile: number
    tablet: number  
    desktop: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className = '' 
}: ResponsiveGridProps) {
  const gridClasses = `
    grid 
    grid-cols-${cols.mobile} 
    md:grid-cols-${cols.tablet} 
    lg:grid-cols-${cols.desktop}
    gap-${gap}
    ${className}
  `

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// Texto responsivo para mobile
interface ResponsiveTextProps {
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  className?: string
}

export function ResponsiveText({ 
  children, 
  size = 'base', 
  weight = 'normal',
  className = '' 
}: ResponsiveTextProps) {
  const mobileSize = {
    'xs': 'text-xs md:text-sm',
    'sm': 'text-sm md:text-base', 
    'base': 'text-base md:text-lg',
    'lg': 'text-lg md:text-xl',
    'xl': 'text-xl md:text-2xl',
    '2xl': 'text-2xl md:text-3xl'
  }

  const fontWeight = `font-${weight}`

  return (
    <span className={`${mobileSize[size]} ${fontWeight} ${className}`}>
      {children}
    </span>
  )
}

// Botão responsivo mobile
interface ResponsiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  fullWidth?: boolean
  mobileCompact?: boolean
  className?: string
}

export function ResponsiveButton({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  mobileCompact = false,
  className = ''
}: ResponsiveButtonProps) {
  const mobileClasses = mobileCompact 
    ? 'px-3 py-2 text-sm md:px-4 md:py-2 md:text-base'
    : 'px-4 py-3 md:px-6 md:py-3'
    
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${mobileClasses}
        ${className}
      `}
    >
      {children}
    </Button>
  )
}

// Seção colapsável para mobile
interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
  className?: string
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false,
  icon,
  className = '' 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`border rounded-lg ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-left">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 border-t bg-gray-50/50">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// Modal mobile otimizado
interface MobileModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function MobileModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '' 
}: MobileModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 
        transform transition-transform duration-300 ease-out
        md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        md:bottom-auto md:max-w-lg md:rounded-2xl
        ${className}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}

// Bottom sheet para mobile
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: string[]
  className?: string
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  className = '' 
}: BottomSheetProps) {
  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 
        transform transition-transform duration-300 ease-out
        max-h-[85vh] overflow-y-auto
        md:hidden
        ${className}
      `}>
        <div className="sticky top-0 bg-white border-b p-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </>
  )
}

// Touch gestures para mobile
export function useTouchGestures() {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance

    return {
      isLeftSwipe,
      isRightSwipe, 
      isUpSwipe,
      isDownSwipe,
      distanceX: Math.abs(distanceX),
      distanceY: Math.abs(distanceY)
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}