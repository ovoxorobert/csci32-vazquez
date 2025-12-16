'use client'

import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { getSizeStyles, Size } from './size'
import {
  getVariantBackgroundStyles,
  getVariantButtonTextStyles,
  getVariantOutlineStyles,
  Variant,
} from './variant'
import { getCommonStyles } from './tokens'

interface BaseButtonProps {
  className?: string
  size?: Size
  variant?: Variant
}

interface ButtonAsButton
  extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined
}

interface ButtonAsLink
  extends BaseButtonProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  disabled?: boolean
}

export type ButtonProps = ButtonAsButton | ButtonAsLink

export const Button = ({
  children,
  className,
  href,
  size = Size.MEDIUM,
  variant = Variant.PRIMARY,
  onClick,
  disabled,
  ...rest
}: ButtonProps) => {
  const sizeCssClasses = getSizeStyles(size)
  const variantBackgroundCssClasses = getVariantBackgroundStyles(variant)
  const variantOutlineCssClasses = getVariantOutlineStyles(variant)
  const variantButtonTextCssClasses = getVariantButtonTextStyles(variant)
  const commonCssClasses = getCommonStyles()

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'transition-opacity duration-200'

  const completedCssClasses = [
    sizeCssClasses,
    variantBackgroundCssClasses,
    variantOutlineCssClasses,
    variantButtonTextCssClasses,
    commonCssClasses,
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        onClick={onClick as any}
        className={completedCssClasses}
        aria-disabled={disabled}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={completedCssClasses}
      onClick={onClick as any}
      disabled={disabled}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
