# React to Next.js 14+ Migration Notes

## Current Project Analysis

### Technology Stack
- **Framework**: React 18.2.0 + Vite 6.1.0
- **Router**: React Router DOM 7.2.0
- **Language**: Mixed JS/TS (mostly JSX with some TypeScript utils)
- **Styling**: Tailwind CSS 3.4.17 + Tailwind Animate + CSS Modules
- **UI Library**: Radix UI components + Shadcn/ui
- **Build Tool**: Vite with path aliases (@)
- **Animation**: Framer Motion 12.4.7
- **Charts**: Recharts 2.15.1
- **Forms**: React Hook Form 7.54.2 + Zod validation
- **State**: Local state + Context (via Base44 local client)

### Current Project Structure
```
src/
├── api/                    # API clients and entities (local storage based)
├── components/             # Reusable components
│   ├── ui/                # Shadcn/ui components
│   ├── dashboard/         # Dashboard-specific components
│   ├── family/            # Family management components
│   ├── reports/           # Reports components
│   ├── utils/             # Utility components
│   └── hooks/             # Custom hooks
├── pages/                 # All page components (24 total)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── utils/                 # TypeScript utilities
└── agents/                # AI agents functionality
```

## Current Routing System

### React Router Setup
- **Router**: BrowserRouter in `src/pages/index.jsx`
- **Layout**: Common layout wrapper in `src/pages/Layout.jsx`
- **Route Detection**: Custom `_getCurrentPage()` function based on URL parsing

### Page Routes Mapping (24 pages total)
| Current Path | Page Component | Next.js App Router Path |
|-------------|---------------|------------------------|
| `/` | Dashboard | `app/page.jsx` |
| `/Dashboard` | Dashboard | `app/dashboard/page.jsx` |
| `/AddExpense` | AddExpense | `app/add-expense/page.jsx` |
| `/ExpensesList` | ExpensesList | `app/expenses-list/page.jsx` |
| `/Analytics` | Analytics | `app/analytics/page.jsx` |
| `/Subscription` | Subscription | `app/subscription/page.jsx` |
| `/MonthlyReport` | MonthlyReport | `app/monthly-report/page.jsx` |
| `/ManageEvents` | ManageEvents | `app/manage-events/page.jsx` |
| `/ManageBudgets` | ManageBudgets | `app/manage-budgets/page.jsx` |
| `/ManageCategories` | ManageCategories | `app/manage-categories/page.jsx` |
| `/CameraReceipts` | CameraReceipts | `app/camera-receipts/page.jsx` |
| `/AIAssistant` | AIAssistant | `app/ai-assistant/page.jsx` |
| `/FinancialPlanner` | FinancialPlanner | `app/financial-planner/page.jsx` |
| `/MyFamily` | MyFamily | `app/my-family/page.jsx` |
| `/FamilyReport` | FamilyReport | `app/family-report/page.jsx` |
| `/FamilyMonthlyReport` | FamilyMonthlyReport | `app/family-monthly-report/page.jsx` |
| `/FamilyDashboard` | FamilyDashboard | `app/family-dashboard/page.jsx` |
| `/PrivacyPolicy` | PrivacyPolicy | `app/privacy-policy/page.jsx` |
| `/TermsOfService` | TermsOfService | `app/terms-of-service/page.jsx` |
| `/Support` | Support | `app/support/page.jsx` |
| `/Contact` | Contact | `app/contact/page.jsx` |
| `/FAQ` | FAQ | `app/faq/page.jsx` |
| `/FamilyIncome` | FamilyIncome | `app/family-income/page.jsx` |
| `/SetupAccount` | SetupAccount | `app/setup-account/page.jsx` |
| `/StripeEventMonitor` | StripeEventMonitor | `app/stripe-event-monitor/page.jsx` |
| `/CheckoutSuccess` | CheckoutSuccess | `app/checkout-success/page.jsx` |
| `/Pricing` | Pricing | `app/pricing/page.jsx` |
| `/CheckoutCancel` | CheckoutCancel | `app/checkout-cancel/page.jsx` |
| `/Account` | Account | `app/account/page.jsx` |
| `/About` | About | `app/about/page.jsx` |
| `/FinancialChatbot` | FinancialChatbot | `app/financial-chatbot/page.jsx` |

## Migration Strategy

### Phase 1: Setup Next.js Environment
1. Create new Next.js 14+ project structure alongside current Vite setup
2. Install Next.js and required dependencies
3. Configure Next.js config files (next.config.js, tsconfig.json)
4. Setup Tailwind CSS for Next.js
5. Configure path aliases (@ mapping)

### Phase 2: Layout Migration
1. Convert `src/pages/Layout.jsx` to Next.js layout system
2. Create `app/layout.jsx` as root layout
3. Preserve exact styling and structure
4. Handle client-side components with 'use client' directive

### Phase 3: Pages Migration
1. Convert each page component to Next.js App Router format
2. Move from `src/pages/PageName.jsx` to `app/page-name/page.jsx`
3. Add 'use client' directive to components using React hooks/state
4. Preserve all styling, classes, and visual elements exactly

### Phase 4: Components Migration
1. Move all components from `src/components/` to Next.js structure
2. Add 'use client' directives where needed
3. Update import paths to work with Next.js
4. Keep all Radix UI and Shadcn/ui components unchanged

### Phase 5: API and Utils Migration
1. Move API layer (`src/api/`) to Next.js
2. Keep local storage based system unchanged
3. Move utilities and hooks
4. Update import paths

### Phase 6: Configuration and Optimization
1. Update routing utilities (`createPageUrl` function)
2. Configure Next.js for optimal performance
3. Handle static assets and images
4. Setup build and deployment scripts

### Critical Preservation Rules

#### Design Preservation
- **NO CHANGES** to Tailwind classes or CSS
- **NO CHANGES** to component structure or DOM layout
- **NO CHANGES** to colors, spacing, fonts, or visual elements
- **NO REPLACEMENT** of `<img>` tags with `next/image` in this phase
- Preserve all animations and transitions exactly

#### Functional Preservation
- Keep all React hooks and state management unchanged
- Preserve local storage API system
- Keep all form validations and logic identical
- Maintain AI chatbot functionality exactly

#### Breaking Changes to Address
- React Router → Next.js App Router navigation
- Vite path aliases → Next.js path aliases
- Client-side routing → App Router
- Build system (Vite → Next.js)

## Dependencies Changes Required

### Remove
- `vite` and related plugins
- `react-router-dom` 
- `@vitejs/plugin-react`

### Add
- `next` (14+)
- Next.js specific configurations

### Keep Unchanged
- All UI libraries (Radix UI, Tailwind, etc.)
- All business logic libraries
- All styling dependencies

## Implementation Plan

### Commit Strategy
- Small, focused commits for each migration step
- Test after each major component migration
- Preserve Git history and maintain clean commit messages

### Testing Strategy
- Visual regression testing after each page migration
- Functionality testing for all forms and interactions
- Performance comparison with current Vite setup

### Rollback Plan
- Keep current Vite setup intact until full migration complete
- Use feature branch `feat/next-migration`
- Allow easy rollback if issues discovered

## Next Steps
1. Create `feat/next-migration` branch
2. Initialize Next.js 14 with App Router
3. Begin with layout migration
4. Migrate pages one by one, testing each
5. Migrate components and utilities
6. Final testing and optimization
