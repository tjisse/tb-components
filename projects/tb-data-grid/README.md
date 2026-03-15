# TbDataGrid

A high-performance, feature-rich, and signals-first data grid component designed for Angular 20+ applications. It features tight integration with **Spring Data PagedModel** and optimized bundle sizes.

## 🚀 Key Features

- **Signals-First State:** Powered by Angular Signals for ultra-fast reactivity.
- **Spring Data Integration:** Native support for `PagedModel` structure and query parameter mapping via `TbSpringDataService`.
- **Excel-style Filtering:** Robust column-based filtering using Angular CDK Overlays.
- **Bi-directional URL Sync:** Persist sorting, paging, and filters in the browser URL automatically.
- **I18n Ready:** All labels and messages are customizable via `TB_GRID_TRANSLATIONS`.
- **Template-Defined Columns:** Declarative approach to define columns and custom cell templates directly in the template.
- **Intelligent Loading:** Threshold-based spinner to prevent flickering on fast connections.
- **Modular Styles:** Includes a core grid and a pre-configured Bootstrap variant.

---

## 📦 Installation

```bash
pnpm add tb-data-grid @angular/cdk @angular/animations
```

Ensure you have `@fortawesome/fontawesome-free` available in your project for the default icons.

---

## 🛠 Basic Usage

### 1. Simple Data Grid

Define your columns declaratively in the template using the `tb-grid-column` component.

```typescript
import { Component, signal } from '@angular/core';
import { TbDataGridComponent, TbGridColumnComponent } from 'tb-data-grid';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TbDataGridComponent, TbGridColumnComponent],
  template: `
    <tb-data-grid 
      [data]="users()" 
      [totalItems]="100"
      [initialQuery]="initialQuery"
    >
      <tb-grid-column key="id" header="ID" width="80px" />
      <tb-grid-column key="name" header="Name" [sortable]="true" [filterable]="true" />
      <tb-grid-column key="email" header="Email" [sortable]="true" [filterable]="true" />
    </tb-data-grid>
  `
})
export class UserListComponent {
  users = signal([{ id: 1, name: 'John Doe', email: 'john@example.com' }]);
  initialQuery = {
    sort: null,
    pagination: { pageIndex: 0, pageSize: 10 },
    filters: {},
  };
}
```

### 2. Bootstrap Variant

For projects using Bootstrap, use `TbDataGridBootstrapComponent`.

```typescript
import { TbDataGridBootstrapComponent, TbGridColumnComponent } from 'tb-data-grid';

@Component({
  imports: [TbDataGridBootstrapComponent, TbGridColumnComponent],
  template: `
    <tb-data-grid-bootstrap 
      [data]="users()" 
      [totalItems]="total()"
      [initialQuery]="initialQuery"
    >
      <tb-grid-column key="id" header="ID" width="80px" />
      <tb-grid-column key="name" header="Name" [sortable]="true" [filterable]="true" />
    </tb-data-grid-bootstrap>
  `
})
export class UserListBootstrapComponent {
  // ... component logic
}
```

---

## 🎨 Custom Cell Templates

To provide custom rendering for a column, simply place an `<ng-template>` inside the `tb-grid-column`.

```html
<tb-data-grid [data]="users()" [initialQuery]="initialQuery">
  
  <tb-grid-column key="name" header="Name" [sortable]="true"></tb-grid-column>

  <!-- Custom Template for 'email' column -->
  <tb-grid-column key="email" header="Email" [sortable]="true" [filterable]="true">
    <ng-template let-value let-row="row">
      <a [href]="'mailto:' + value">{{ value }}</a>
    </ng-template>
  </tb-grid-column>

  <!-- Custom Template for 'status' column -->
  <tb-grid-column key="status" header="Status">
    <ng-template let-value>
      <span [class]="value === 'active' ? 'badge-success' : 'badge-danger'">
        {{ value }}
      </span>
    </ng-template>
  </tb-grid-column>

</tb-data-grid>
```

---

## 🔗 URL State Persistence

By default, the grid syncs its state (paging, sorting, filters) with the browser URL. You can optionally provide a `urlPrefix` if you have multiple grids on the same page.

```html
<!-- Sync with clean parameters (default): ?page=0&sort=name,desc -->
<tb-data-grid [initialQuery]="initialQuery" .../>

<!-- Sync with prefix: ?u_page=0&u_sort=name,desc&u_f_name=John -->
<tb-data-grid [initialQuery]="initialQuery" [urlPrefix]="'u'" .../>

<!-- Disable URL sync -->
<tb-data-grid [initialQuery]="initialQuery" [urlSync]="false" .../>
```

---

## 🏗 Nested Properties Support

The grid supports nested object properties for data rendering, sorting, and filtering using dot notation. This is particularly useful when working with complex models and Spring Data's default nested property handling.

```html
<tb-grid-column key="name" header="Name" [sortable]="true"></tb-grid-column>
<!-- Display 'city' property from the 'address' object -->
<tb-grid-column key="address.city" header="City" [sortable]="true" [filterable]="true"></tb-grid-column>
```

When a nested key is used:
- **Rendering:** Automatically extracts the value (e.g., `row.address.city`).
- **Sorting:** Sends the dot-notated key to the backend (e.g., `sort=address.city,asc`).
- **Filtering:** Sends the dot-notated key to the backend (e.g., `address.city.contains=Amsterdam`).
- **Row ID:** Supports nested keys for `rowIdKey` (e.g., `[rowIdKey]="'metadata.uuid'"`).

---

## 🌍 Internationalization (I18n)

Override any label by providing a custom value for `TB_GRID_TRANSLATIONS`.

```typescript
import { TB_GRID_TRANSLATIONS, TB_GRID_DEFAULT_TRANSLATIONS } from 'tb-data-grid';

// In your app config
providers: [
  {
    provide: TB_GRID_TRANSLATIONS,
    useValue: {
      ...TB_GRID_DEFAULT_TRANSLATIONS,
      pagination: {
        ...TB_GRID_DEFAULT_TRANSLATIONS.pagination,
        next: 'Volgende',
        previous: 'Vorige'
      }
    }
  }
]
```

---

## 📄 License
MIT
