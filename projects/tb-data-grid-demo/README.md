# TbDataGrid Demo

A showcase application demonstrating the features of the **TbDataGrid** library. This demo is designed to test various grid configurations, real-world data fetching, and state management scenarios.

## 🚀 Getting Started

To start the demo application, run the following command from the workspace root:

```bash
pnpm start
```

Navigate to `http://localhost:4200/` to explore the grid.

## 🛠 Features

### 1. Vanilla Demo (`/vanilla`)
Demonstrates the basic `tb-data-grid` component with standard styles and full feature set.

- **Data Fetching**: Uses a mock API interceptor to simulate real HTTP requests.
- **Filtering**: Column-based text, numeric, and select filtering.
- **Sorting**: Multi-mode sorting (Asc, Desc, None).
- **Pagination**: URL-synced pagination with customizable page sizes.
- **Selection**: Row selection and "Select All" with persistent selection state.
- **Custom Templates**: Demonstrates custom cell rendering for the email column.

### 2. Bootstrap Demo (`/bootstrap`)
Showcases the `tb-data-grid-bootstrap` variant, which wraps the core grid in Bootstrap-compatible classes and layouts.

- **Styling**: Uses standard Bootstrap utility classes (`table`, `table-hover`, `table-bordered`).
- **Responsive**: Fully responsive grid layout within a Bootstrap container.
- **Bulk Actions**: A separate component that reacts to the grid's selection state to perform bulk operations.

### 🧪 Simulation Controls
The demo includes global toggles to test edge cases:

- **Simulate Delay**: Adds a configurable latency to API requests to test the **Loading Spinner** and its threshold.
- **Simulate Error**: Forces API requests to fail to test the **Error State** UI and recovery.

## 📂 Project Structure

- `src/app/components/demo/`: Contains the route-level components for Vanilla and Bootstrap views.
- `src/app/services/demo-state.ts`: Manages shared state for the simulation controls and bulk actions.
- `src/app/app.config.ts`: Configures the mock API interceptor and global Angular providers.

## 📝 Configuration

The demo uses path mapping to link directly to the library's source code. See the root `tsconfig.json` for details.
