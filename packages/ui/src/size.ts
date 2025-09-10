export enum Size {
  SMALL,
  MEDIUM,
  LARGE,
}

export function getSizeStyles(size: Size) {
  switch (size) {
    case Size.SMALL:
      return 'px-4 py-2 rounded shadow'
    case Size.MEDIUM:
      return 'px-6 py-3 rounded-md shadow'
    case Size.LARGE:
      return 'px-8 py-4 rounded-lg shadow'
  }
}

export function getInputSizeStyles(size: Size) {
  switch (size) {
    case Size.SMALL:
      return 'px-4 py-2 rounded shadow'
    case Size.MEDIUM:
      return 'px-6 py-3 rounded-md shadow'
    case Size.LARGE:
      return 'px-8 py-4 rounded-lg shadow'
  }
}
