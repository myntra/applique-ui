export interface Mask {
  /**
   * Check if given token/character is valid.
   *
   * @param token - character matching this mask position.
   */
  validate(token: string): boolean

  /**
   * Transform character to display format.
   *
   * @param token - character matching this mask position.
   */
  transform?(token: string): string

  /**
   * Transform character to required value.
   *
   * @param token - character matching this mask position.
   */
  getToken?(): string
}

export const MASKS: Record<string, Mask> = {
  d: {
    validate: (token) => /^\d$/.test(token),
  },
  w: {
    validate: (token) => /^\w$/.test(token),
  },
  L: {
    validate: (token) => /^[A-Z]$/.test(token),
    transform: (token) => token.toUpperCase(),
  },
  l: {
    validate: (token) => /^[a-z]$/.test(token),
    transform: (token) => token.toLowerCase(),
  },
  A: {
    validate: (token) => /^[0-9A-Z_]$/.test(token),
    transform: (token): string => token.toUpperCase(),
  },
  a: {
    validate: (token) => /^[0-9a-z_]$/.test(token),
    transform: (token) => token.toLowerCase(),
  },
  '*': {
    validate: (token) => /^[a-zA-Z]$/.test(token),
  },
}
