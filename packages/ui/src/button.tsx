'use client'

import { ReactNode } from 'react'
import { Size } from './size'
import { Variant } from './variant'

interface ButtonProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  size?: Size
  variant?: Variant
}

export const Button = ({
  children,
  className,
  href,
  onClick,
  size = Size.MEDIUM,
  variant = Variant.PRIMARY,
}: ButtonProps) => {
  let sizeCssClasses = ''
  switch (size) {
    case Size.SMALL:
      sizeCssClasses = 'px-4 py-2 rounded shadow'
      break
    case Size.MEDIUM:
      sizeCssClasses = 'px-6 py-3 rounded-md shadow'
      break
    case Size.LARGE:
      sizeCssClasses = 'px-8 py-4 rounded-lg shadow'
      break
  }

  let variantCssClasses = ''
  switch (variant) {
    case Variant.PRIMARY:
      variantCssClasses = 'bg-gray-400 outline-gray-400 hover:bg-gray-600 active:bg-gray-700'
      break
    case Variant.SECONDARY:
      variantCssClasses = 'bg-gray-400 outline-gray-400 hover:bg-gray-600 active:bg-gray-700'
      break
    case Variant.TERTIARY:
      variantCssClasses = 'bg-gray-400 outline-gray-400 hover:bg-gray-600 active:bg-gray-700'
      break
  }
  const commonCssClasses =
    'flex items-center justify-center text-white focus:outline outline-offset-2 transition-colors'
  const completedCssClasses = `${sizeCssClasses} ${variantCssClasses} ${className} ${commonCssClasses}`
  return href ? (
    <a href={href} className={completedCssClasses}>
      {children}
    </a>
  ) : (
    <button className={completedCssClasses} onClick={onClick}>
      {children}
    </button>
  )
}
