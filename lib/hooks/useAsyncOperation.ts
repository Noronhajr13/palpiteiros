'use client'

import { useState, useCallback, useEffect } from 'react'

interface UseAsyncOperationResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: unknown[]) => Promise<T | null>
  reset: () => void
}

interface UseAsyncOperationOptions {
  initialLoading?: boolean
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

/**
 * Hook customizado para operações assíncronas com estados de loading, error e data
 * Elimina a repetição de useState para loading, error em múltiplos componentes
 */
export function useAsyncOperation<T = unknown>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationResult<T> {
  const { initialLoading = false, onSuccess, onError } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...args: unknown[]) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await asyncFunction(...args)
      setData(result)
      onSuccess?.(result)
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      onError?.(err as Error)
      return null
    } finally {
      setLoading(false)
    }
  }, [asyncFunction, onSuccess, onError])

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

/**
 * Hook especializado para operações que fazem fetch de dados
 */
export function useFetch<T = unknown>(
  url: string | null,
  options: UseAsyncOperationOptions & { autoFetch?: boolean } = {}
) {
  const { autoFetch = true, ...asyncOptions } = options
  
  const fetchData = useCallback(async () => {
    if (!url) throw new Error('URL é obrigatória')
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
    
    return response.json() as T
  }, [url])

  const result = useAsyncOperation<T>(fetchData, asyncOptions)

  // Auto-fetch quando URL muda (se habilitado)
  useEffect(() => {
    if (autoFetch && url) {
      result.execute()
    }
  }, [autoFetch, url, result]) // Incluindo result na dependência

  return result
}

/**
 * Hook para simular delay de API (útil durante desenvolvimento)
 */
export function useSimulatedAsync<T = unknown>(
  data: T,
  delay: number = 1000,
  options: UseAsyncOperationOptions = {}
) {
  const simulatedFunction = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, delay))
    return data
  }, [data, delay])

  return useAsyncOperation<T>(simulatedFunction, options)
}
