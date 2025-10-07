'use client'

import { Button } from '@/components/ui/button'
import { Chrome, Loader2 } from 'lucide-react'

interface SocialLoginProps {
  onGoogleLogin: () => Promise<void>
  loading: boolean
}

export function SocialLogin({ onGoogleLogin, loading }: SocialLoginProps) {
  return (
    <>
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">
            ou continue com
          </span>
        </div>
      </div>

      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full py-6"
        onClick={onGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Chrome className="h-5 w-5 mr-2" />
            Google
          </>
        )}
      </Button>
    </>
  )
}
