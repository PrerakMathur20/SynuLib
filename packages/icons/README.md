# @tokis/icons

Tree-shakable SVG icon library for Tokis. Zero dependencies — use the built-in icons directly, or opt into lucide-react as an optional peer.

## Installation

```bash
npm install @tokis/icons
```

> Or install everything at once: `npm install @tokis/tokis`

## Usage

### Built-in icons

```tsx
import { SearchIcon, XIcon, ChevronDownIcon } from '@tokis/icons';

function MyComponent() {
  return <SearchIcon aria-label="Search" />;
}
```

### lucide-react bridge (optional)

If you already have `lucide-react` installed, you can use the bridge entry point to consume Lucide icons through the Tokis icon interface:

```bash
npm install lucide-react
```

```tsx
import { SearchIcon } from '@tokis/icons/lucide';
```

## Peer Dependencies

- `react` >= 18.0.0
- `lucide-react` >= 0.300.0 *(optional — only required for the `/lucide` entry point)*

## Documentation

Visit [Tokis Documentation](https://prerakmathur20.github.io/TokisWebsite/) for the full icon catalogue.

## License

MIT
