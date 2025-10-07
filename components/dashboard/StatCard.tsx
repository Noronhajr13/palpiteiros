import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScaleOnHover } from '@/components/ui/animations'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  loading?: boolean
}

export function StatCard({ title, value, subtitle, icon: Icon, loading }: StatCardProps) {
  return (
    <ScaleOnHover scale={1.05}>
      <Card className="relative overflow-hidden group border-border">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {loading ? (
            <div className="h-8 bg-muted/50 rounded animate-pulse" />
          ) : (
            <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
          )}
          <p className="text-accent text-sm font-medium">{subtitle}</p>
        </CardContent>
      </Card>
    </ScaleOnHover>
  )
}
