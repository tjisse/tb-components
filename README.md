# TbComponents

**[Live Demo](https://tjisse.github.io/tb-components/)**

A modern Angular workspace for high-quality UI components. This project uses [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10 and is managed with `pnpm`.

## 📂 Project Structure

- **`projects/tb-data-grid`**: The core library. A high-performance, signals-first data grid for Angular 20+.
- **`projects/tb-data-grid-demo`**: A showcase application that demonstrates the grid's features (Vanilla and Bootstrap variants).

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

### Development Server

To start the demo application:

```bash
pnpm start
```

Navigate to `http://localhost:4200/` to view the demo.

### Building the Library

To build the `tb-data-grid` library for production:

```bash
ng build tb-data-grid
```

The artifacts will be stored in the `dist/tb-data-grid` directory.

### Running Tests

To run unit tests (Vitest):

```bash
pnpm test
```

To run end-to-end (E2E) tests (Playwright):

```bash
pnpm e2e
```

Use `pnpm e2e:ui` to run tests in the interactive Playwright UI mode.

## 📄 License

MIT
