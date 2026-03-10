## Eventeny – Vendor Application Management Exercise

A single-page React (Vite) application that implements a **Vendor Application Management** screen with:

- Search
- Advanced filter dropdown
- Interactive, responsive table
- Applicant profile view

The goal was to translate a Figma design into **production-ready, accessible UI** across desktop (1440px), tablet (768px), and mobile (375px).

---

### Objective

**Objective:** Enable event organizers to efficiently **search, filter, review, and manage vendor applications** in one place.  
**Resulting impact:** Reduce time to find relevant vendors, improve confidence in decisions, and create a UI that scales from early prototypes to production with maintainable code, strong accessibility, and clear interaction patterns.

---

### Research tactics & findings

- **Heuristic/a11y review of the design**
  - Ensured controls have **clear labels**, visible focus states, and sufficient color contrast.
  - Identified where ARIA roles or live regions would help (table summaries, bulk selection, empty/loading states).
- **Interaction tradeoffs**
  - **Search debounce (300ms)** to balance responsiveness with avoiding excessive filter churn.
  - **Client-side filtering** only (no back end), but filtering logic is centralized in a reusable helper to ease future API integration.
  - **Table pagination vs. infinite scroll:** chose pagination to keep state predictable and tests straightforward.
  - **Desktop table vs. mobile cards:** duplicated markup per layout is a tradeoff for much better small-screen readability and interaction.

---

### Code structure review

- **High-level structure**
  - `frontend/`: Vite React app (current implementation).
    - `frontend/src/App.jsx`: top-level composition; owns global state for search, filters, rows, and selected applicant. Handles data loading and passes filtered rows to `Table`.
    - `frontend/src/api/mockApi.js`: mock dataset and pure helpers (`applyFilters`, `getData`, `getApplicantProfile`).
    - `frontend/src/components/`
      - `Search/`: search input with debounce and clear affordance.
      - `Filters/`: advanced filter trigger + panel (desktop popover + mobile bottom sheet), including `SelectDropdown` for Application.
      - `Table/`: desktop table + mobile card layout, sorting, bulk selection with bulk status action, pagination.
      - `Profile/`: applicant profile detail page (bonus feature).
      - `common/SelectDropdown/`: reusable select dropdown used by Filters (Application) and Table (bulk status + status pill styling).
    - `frontend/src/hooks/useIsMobile.js`: small hook around `matchMedia` for responsive behavior in JS (used in Filters + Table pagination).
  - `backend/`: reserved for a future real API implementation (kept in the same git repo, not yet implemented).

- **Component hierarchy (simplified)**
  - `App`
    - `Search`
    - `Filters`
      - `SelectDropdown` (applications)
    - `Table`
      - Desktop `<table>` rows
      - Mobile `<article>` cards
    - `Profile` (conditionally rendered when an applicant is selected)

- **State management decisions**
  - **Global-ish state in `App`:**
    - `searchValue`, `filters`, `allRows`, `selectedApplicant`.
    - `rows` derived via `useMemo(() => applyFilters(allRows, searchValue, filters))`.
  - **Local state in leaf components:**
    - `Search`: local input value + debounced commit to parent.
    - `Filters`: filter panel open/close, driven by a single trigger, then updates parent filters.
    - `Table`: sort direction, page, bulk selection; reset by remount when filters/search change (via `key` on `<Table />`).
    - `SelectDropdown`: open/close state and option selection.
  - **Data layer approach:**
    - `getData()` returns the full dataset; **all filtering is done client-side** in `App` using `applyFilters`, to align with the “no backend required” constraint.

- **Styling approach**
  - **CSS modules by feature folder** (plain CSS files colocated with components).
  - **Design tokens via CSS variables** in `index.css`:
    - Colors, radii, shadows, transitions, status color tokens, etc.
  - Layout responsiveness handled with **media queries** in each component’s CSS (`Table.css`, `Filters.css`, `Search.css`, `App.css`).
  - Table uses **min-width + scroll container** for wide desktop; mobile layout swaps to cards.

---

### Accessibility strategy

- **Landmarks & semantics**
  - `App` uses `<main id="main-content">` with a **skip link**.
  - `Table` is wrapped in a region (`role="region" aria-label="Applications table"`) and uses a semantic `<table>` on desktop and ARIA list structure (`role="list"`, `role="listitem"`) on mobile cards.
  - Bulk actions toolbar is identified with `role="toolbar" aria-label="Bulk actions"`.

- **ARIA roles & attributes**
  - Table headers and cells use proper `scope="col"` and column headers for sort and status.
  - Sort button uses `aria-sort="ascending|descending"` and descriptive `aria-label` (“Sort by Business name…”).
  - Row status pills/buttons include `aria-label`s (“Approved status”) so the status is read clearly.
  - Filters:
    - Trigger uses `aria-expanded`, `aria-haspopup`, and `aria-controls` to tie trigger to panel.
    - Panel is a `role="dialog"`; on mobile, it also uses `aria-modal`.
    - Filter groups use `role="group"` with `aria-labelledby` for status/payment sections.
  - Search group uses `role="group" aria-label="Search"` around the input and clear button.

- **Keyboard interaction patterns**
  - Search is a standard `<input>` with a focus-ring; clear button is reachable by keyboard and announces “Clear search”.
  - Filters trigger is a standard `<button>`; panel content is fully keyboard navigable (checkboxes, dropdown).
  - Business name in the table is rendered as a `role="button"` with Enter/Space handlers to open the Profile.
  - Action menus and checkboxes are native buttons/inputs with clear labels.

- **Focus management**
  - When toggling between list and profile (`selectedApplicant` changes), focus is moved to the `<main>` region so screen readers announce main content.
  - Within `Profile`, the heading is given `tabIndex={-1}` and focused on mount for context.
  - Filters panel:
    - When opened, focus moves to the **first focusable control** inside.
    - When closed, focus is restored to the Filters trigger.
  - Mobile filter bottom sheet locks scroll (`document.body.style.overflow = 'hidden'`) and uses a backdrop to prevent focus leaks.

- **Color contrast**
  - Text and icon colors are derived from design tokens in `index.css` and chosen to meet or approximate WCAG AA for body text and primary actions.
  - Status badges use distinct background + text combinations to support color-blind users.

---

### Testing strategy

- **What is tested**
  - **Search**: debounce behavior, calling `onChange` with the right values, clear button behavior.
  - **Filters**: opening/closing, interaction with status/payment/application filters, keyboard and screen-reader accessible labels.
  - **Table**:
    - Rendering of rows and headers.
    - Sorting by business name and `aria-sort` toggling.
    - Bulk selection (select all / individual rows), bulk bar visibility, and clear selection.
    - Pagination controls and `aria-current` on the active page.
    - Status and payment rendering, action buttons per row.
  - **Profile**: correct mapping of application data to the profile view, external link behavior, and sticky actions on mobile.
  - **SelectDropdown**: open/close, option selection, and placeholder behavior.

- **Accessibility & edge cases**
  - Loading state (`role="status" aria-live="polite"`) and empty state messages for the table.
  - Screen-reader-only live region summarizing “Showing X to Y of Z applications”.
  - Behavior when there are no rows after filtering, when all rows are selected, when toggling filters rapidly, and when opening/closing filters on mobile.

---

### Collaboration plan

- **With Product & Design**
  - Co-review the Figma file to agree on interaction details (e.g., how many tags to show, pagination rules on mobile, what happens when status is long).
  - Maintain a shared **component inventory** so new screens reuse Search/Filters/Table/Profile rather than reinventing them.

- **With Engineering**
  - Define a stable, typed data contract for vendor applications and profiles (today mocked in `mockApi.js`).
  - Align on a state-management approach if/when this grows beyond a single page (e.g., data fetching libs, router integration).
  - Add **lint + test** checks to CI so accessibility and regressions are caught early.

- **With QA & Accessibility**
  - Create a checklist for:
    - Keyboard-only flows (search → filter → table → profile → back).
    - Screen reader happy-path flows (review a vendor, check status, open actions).
  - Plan targeted manual testing on real devices at the three breakpoints.

- **With Stakeholders**
  - Provide short Loom/demo walkthroughs showing:
    - How organizers search, filter, bulk-select, and drill into profiles.
    - How the UI behaves at different viewport widths.

---

### Intentional functionality (experience improvement beyond the baseline spec)

The assignment already required specific behaviors for **Search**, **Advanced filters**, and the **Interactive table**. Beyond those baseline requirements, I added one notable enhancement:

- **Applicant Profile page**: a dedicated view with contextual details and actions for a selected vendor.
  - **Why:** In realistic workflows, organizers don’t just scan tables—they open a detailed view before deciding. Providing a dedicated profile:
    - Reduces context-switching (no need to cross-reference external tools).
    - Shows how the table integrates into a larger workflow.
    - Demonstrates that the table actions (e.g., “View applicant”) are wired into a real, navigable flow.

---

### Setup

From the repo root:

```bash
npm install        # installs root dev scripts only
cd frontend
npm install        # install frontend dependencies
npm run dev
```

Visit the local dev URL (typically `http://localhost:5173`) to explore the Vendor Application Management page.

---

### Scripts

- `npm run dev` – start development server
- `npm run build` – build for production
- `npm run preview` – preview production build
