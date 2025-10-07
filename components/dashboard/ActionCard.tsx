import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ScaleOnHover } from '@/components/ui/animations'
import { LucideIcon } from 'lucide-react'

interface ActionCardProps {
  href: string
  title: string
  subtitle: string
  icon: LucideIcon
  variant: 'primary' | 'success' | 'purple' | 'warning'
}

const variantStyles = {
  primary: 'bg-black hover:bg-primary-hover',
  success: 'bg-green-600 hover:bg-green-700',
  purple: 'bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600',
  warning: 'bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600',
}

export function ActionCard({ href, title, subtitle, icon: Icon, variant }: ActionCardProps) {
  return (
    <Link href={href}>
      <ScaleOnHover scale={1.08}>
        <Card className={`${variantStyles[variant]} border-transparent transition-all duration-300 cursor-pointer group relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="flex items-center justify-center p-8 relative z-10">
            <div className="text-center">
              <div className="mb-4 p-3 bg-white/20 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-semibold text-lg">{title}</p>
              <p className="text-white/80 text-sm mt-1">{subtitle}</p>
            </div>
          </CardContent>
        </Card>
      </ScaleOnHover>
    </Link>
  )
}
