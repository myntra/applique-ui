const json = [
  {
    name: 'type',
    default: 'secondary',
    description: 'The visual style to convey purpose of the button.',
    type: '"secondary" | "primary" | "link" | "text"',
  },
  {
    name: 'notifications',
    default: null,
    description:
      'Will show the button as a notification button with the number of notifications. (provided)',
    type: 'number',
  },
  {
    name: 'children',
    default: null,
    description: 'The label text of the button.',
    type: 'ReactNode',
  },
  {
    name: 'onClick',
    default: null,
    description: 'The handler to call when the button is clicked.',
    type: '(event: MouseEvent) => void',
  },
  {
    name: 'icon',
    default: null,
    description: 'The name of the icon (displayed on left side of content).',
    type: 'ReactNode',
  },
  {
    name: 'secondaryIcon',
    default: null,
    description: 'The name of the icon (displayed on right side of content).',
    type: 'ReactNode',
  },
  {
    name: 'disabled',
    default: false,
    description:
      'Disables the button (changes visual style and ignores button interactions).',
    type: 'boolean',
  },
  {
    name: 'loading',
    default: false,
    description: 'Changes visual style to show progress.',
    type: 'boolean',
  },
  {
    name: 'inheritTextColor',
    default: false,
    description: 'Uses current text color (useful for link buttons).',
    type: 'boolean',
  },
  {
    name: 'htmlType',
    default: null,
    description:
      "The 'type' attribute for the button element (as 'type' is used for defining visual type)",
    type: '"submit" | "reset" | "button"',
  },
  {
    name: 'to',
    default: null,
    description:
      'The URL to navigate to when the button is clicked (uses client side router).',
    type: 'string | object',
  },
  {
    name: 'href',
    default: null,
    description:
      'The URL to navigate to when the button is clicked (uses browser anchor tag).',
    type: 'string',
  },
  {
    name: 'transform',
    default: 'uppercase',
    description: 'The transform attribute to transform button label.',
    type: '"uppercase" | "none" | "capitalize" | "lowercase"',
  },
  {
    name: 'size',
    default: 'regular',
    description: 'Size of the button',
    type: '"regular" | "small" | "large"',
  },
  {
    name: 'color',
    default: null,
    description: 'Backgroud color for button',
    type: 'string',
  },
  {
    name: 'caption',
    default: null,
    description: 'This will be used for large buttons',
    type: 'string',
  },
]
export default json
