'use client'

import { useState, useCallback, ChangeEvent } from 'react'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

interface UseFormHandlerOptions<T extends Record<string, string>> {
  initialValues: T
  validationRules?: Partial<Record<keyof T, ValidationRule>>
  onSubmit?: (values: T) => Promise<boolean> | boolean
  validateOnChange?: boolean
}

/**
 * Hook customizado para gerenciamento de formulários com validação
 * Elimina a repetição de useState e handleChange em formulários
 */
export function useFormHandler<T extends Record<string, string>>(
  options: UseFormHandlerOptions<T>
) {
  const { 
    initialValues, 
    validationRules = {}, 
    onSubmit, 
    validateOnChange = false 
  } = options

  // Estado do formulário
  const [formData, setFormData] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [loading, setLoading] = useState(false)

  // Validar um campo específico
  const validateField = useCallback((name: keyof T, value: string): string | null => {
    const rules = (validationRules as Partial<Record<keyof T, ValidationRule>>)[name]
    if (!rules) return null

    if (rules.required && !value.trim()) {
      return 'Este campo é obrigatório'
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Deve ter pelo menos ${rules.minLength} caracteres`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Deve ter no máximo ${rules.maxLength} caracteres`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Formato inválido'
    }

    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }, [validationRules])

  // Atualizar valor do campo
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof T

    setFormData(prev => ({ ...prev, [fieldName]: value }))

    if (validateOnChange || touched[fieldName]) {
      const error = validateField(fieldName, value)
      setErrors(prev => ({ ...prev, [fieldName]: error || undefined }))
    }
  }, [validateField, validateOnChange, touched])

  // Marcar campo como tocado
  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    const fieldName = name as keyof T

    setTouched(prev => ({ ...prev, [fieldName]: true }))

    const error = validateField(fieldName, formData[fieldName])
    setErrors(prev => ({ ...prev, [fieldName]: error || undefined }))
  }, [validateField, formData])

  // Validar todo o formulário
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof T
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [formData, validateField])

  // Submeter formulário
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!validateForm()) {
      return false
    }

    if (onSubmit) {
      setLoading(true)
      try {
        const result = await onSubmit(formData)
        return result
      } catch (error) {
        console.error('Erro no submit:', error)
        return false
      } finally {
        setLoading(false)
      }
    }

    return true
  }, [validateForm, onSubmit, formData])

  // Reset do formulário
  const reset = useCallback(() => {
    setFormData(initialValues)
    setErrors({})
    setTouched({})
    setLoading(false)
  }, [initialValues])

  // Atualizar valores programaticamente
  const setValue = useCallback((name: keyof T, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  // Verificar se formulário é válido
  const isValid = Object.values(errors).every(error => !error)
  const hasErrors = Object.values(errors).some(error => error)

  return {
    formData,
    errors,
    touched,
    loading,
    isValid,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    reset,
    setValue
  }
}

/**
 * Regras de validação pré-definidas
 */
export const ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Email inválido'
      }
      return null
    }
  },
  password: {
    required: true,
    minLength: 6
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  codigo: {
    required: true,
    minLength: 4,
    maxLength: 10,
    custom: (value: string) => {
      if (value && !/^[A-Z0-9]+$/.test(value.toUpperCase())) {
        return 'Código deve conter apenas letras e números'
      }
      return null
    }
  }
} as const
