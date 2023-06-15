const json = {
  Badge: {
    name: 'Badge',
    data: [
      {
        name: 'type',
        default: 'info',
        description: 'The visual style to convey purpose of the badge.',
        type: '"info" | "success" | "warning" | "error"',
      },
      {
        name: 'children',
        default: null,
        description: 'The label text of the badge.',
        type: 'string',
      },
      {
        name: 'variant',
        default: 'solid',
        description: 'Variant  of the badge',
        type: '"solid" | "outlined"',
      },
      { name: 'icon', default: null, description: '', type: 'ReactNode' },
      { name: 'onClose', default: null, description: '', type: '() => void' },
    ],
  },
}
export default json
