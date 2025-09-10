export enum Variant {
  PRIMARY,
  SECONDARY,
  TERTIARY,
}

export function getVariantBackgroundStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'bg-green-400  hover:bg-green-600 active:bg-green-700'
    case Variant.SECONDARY:
      return 'bg-red-400  hover:bg-red-600 active:bg-red-700'
    case Variant.TERTIARY:
      return 'bg-blue-400  hover:bg-blue-600 active:bg-blue-700'
  }
}

export function getVariantOutlineStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'outline-green-400'
    case Variant.SECONDARY:
      return 'outline-red-400'
    case Variant.TERTIARY:
      return 'outline-blue-400'
  }
}

export function getVariantBorderStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'border-2 border-green-400'
    case Variant.SECONDARY:
      return 'border-2 border-red-400'
    case Variant.TERTIARY:
      return 'border-2 border-blue-400'
  }
}

export function getVariantInputTextStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'text-black placeholder-green-400'
    case Variant.SECONDARY:
      return 'text-black placeholder-red-400'
    case Variant.TERTIARY:
      return 'text-black placeholder-blue-400'
  }
}

export function getVariantButtonTextStyles(variant: Variant) {
  switch (variant) {
    case Variant.PRIMARY:
      return 'text-white placeholder-green-400'
    case Variant.SECONDARY:
      return 'text-white placeholder-red-400'
    case Variant.TERTIARY:
      return 'text-white placeholder-blue-400'
  }
}
