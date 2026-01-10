# File & Folder Structure Blueprint

This document defines the exact folder structure and architectural layering for the Performance-First Token-Native UI Library.

The goal is long-term scalability, framework isolation, strict layering, and future multi-framework expansion.

---

# 1. Monorepo Root Structure

```
root/
│
├── apps/
│   ├── playground/            → Local dev sandbox
│   ├── docs/                  → Documentation site (Next.js / VitePress)
│
├── packages/
│   ├── core/                  → Framework-agnostic primitives
│   ├── react/                 → React adapter layer
│   ├── tokens/                → Design token engine
│   ├── theme/                 → Default styled layer (CSS)
│   ├── icons/                 → Icon system
│   ├── utils/                 → Shared utilities
│
├── tooling/
│   ├── eslint-config/
│   ├── tsconfig/
│   ├── build-config/
│
├── .changeset/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json (if using Turborepo)
└── README.md
```

---

# 2. Package-Level Blueprint

---

# 2.1 packages/tokens

Responsible for:

* Token schema
* Theme definitions
* CSS variable generation
* Type safety

Structure:

```
tokens/
│
├── src/
│   ├── primitives/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── radius.ts
│   │   ├── typography.ts
│   │   ├── shadows.ts
│   │   ├── motion.ts
│   │   ├── zIndex.ts
│   │   └── breakpoints.ts
│   │
│   ├── semantic/
│   │   ├── color.ts
│   │   ├── surface.ts
│   │   ├── text.ts
│   │   └── border.ts
│   │
│   ├── themes/
│   │   ├── light.ts
│   │   ├── dark.ts
│   │   └── index.ts
│   │
│   ├── css/
│   │   ├── generate-css-vars.ts
│   │   └── index.css
│   │
│   ├── types.ts
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

Key Rules:

* Semantic tokens must reference primitives only.
* No component-specific tokens inside this package.
* Output must be JSON serializable.

---

# 2.2 packages/core (Framework-Agnostic Primitives)

Responsible for:

* Accessibility logic
* State machines
* Keyboard interactions
* Focus management
* ARIA handling

Absolutely NO:

* React imports
* Styling imports
* CSS frameworks

Structure:

```
core/
│
├── src/
│   ├── primitives/
│   │   ├── button/
│   │   │   ├── button.machine.ts
│   │   │   ├── button.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── modal/
│   │   ├── popover/
│   │   ├── tabs/
│   │   └── accordion/
│   │
│   ├── focus/
│   │   ├── focus-trap.ts
│   │   ├── roving-tabindex.ts
│   │   └── use-focus-visible.ts
│   │
│   ├── a11y/
│   │   ├── aria-helpers.ts
│   │   └── id-generator.ts
│   │
│   ├── state/
│   │   ├── controllable-state.ts
│   │   └── create-machine.ts
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

Design Pattern:

* Core exposes logic APIs.
* No DOM assumptions unless absolutely necessary.
* State machine pattern preferred for complex components.

---

# 2.3 packages/react (Adapter Layer)

Responsible for:

* Mapping core logic to React
* Hook wrappers
* forwardRef support
* Slot-based component composition

Structure:

```
react/
│
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   ├── ButtonRoot.tsx
│   │   │   ├── ButtonIcon.tsx
│   │   │   ├── ButtonLabel.tsx
│   │   │   ├── useButton.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── modal/
│   │   ├── popover/
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useControllableState.ts
│   │   └── useId.ts
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   └── ConfigProvider.tsx
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

Important:

* React layer should be thin.
* All heavy logic must live in core.

---

# 2.4 packages/theme (Styled Layer)

Responsible for:

* Default visual identity
* CSS files
* Component styling
* Motion styling

Structure:

```
theme/
│
├── src/
│   ├── base/
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── variables.css
│   │
│   ├── components/
│   │   ├── button.css
│   │   ├── modal.css
│   │   ├── popover.css
│   │   └── ...
│   │
│   ├── utilities/
│   │   ├── layout.css
│   │   └── motion.css
│   │
│   └── index.css
│
├── package.json
└── README.md
```

Rules:

* Use CSS variables only.
* No runtime style injection.
* Keep styles layered and predictable.

---

# 2.5 packages/icons

```
icons/
│
├── src/
│   ├── Icon.tsx
│   ├── icons/
│   │   ├── Add.tsx
│   │   ├── Close.tsx
│   │   └── ...
│   └── index.ts
```

Guidelines:

* Tree-shakable SVG components.
* Stroke-based icons for consistency.

---

# 2.6 packages/utils

Shared utilities only.

```
utils/
│
├── src/
│   ├── mergeProps.ts
│   ├── composeEventHandlers.ts
│   ├── classNames.ts
│   └── index.ts
```

No cross-package circular dependencies allowed.

---

# 3. Layering Rules (Strict)

Allowed dependency graph:

```
tokens → theme → react
core → react
utils → core
utils → react
```

Forbidden:

* theme importing react
* core importing theme
* react importing build tooling

---

# 4. Export Strategy

Each package must support:

* ESM
* CJS
* Type definitions
* Side-effect-free modules
* Named exports only

Example:

```
export { Button } from "./components/button"
```

---

# 5. Future Multi-Framework Strategy

To support Vue or Svelte later:

1. core must remain framework-neutral.
2. tokens must not rely on React.
3. theme must remain plain CSS.
4. Create new adapter package:

```
packages/vue/
packages/svelte/
```

Adapters should wrap core logic similarly to react.

---

# 6. Dev Workflow Structure

* Storybook runs from playground
* Docs imports from built packages
* CI validates:

  * Bundle size
  * Type integrity
  * Accessibility checks

---

# 7. Structural Integrity Goals

The folder structure must ensure:

* Clear separation of concerns
* Minimal surface coupling
* Long-term maintainability
* Enterprise-level scalability

This structure is designed to:

* Support real SaaS dashboards
* Enable white-label enterprise theming
* Scale into multi-framework support
* Preserve engineering purity

End of File & Folder Blueprint.
