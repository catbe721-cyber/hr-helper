<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HR Helper / TeamSpirit

A React application for HR management built with Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📦 Deployment

This project is configured with GitHub Actions for automatic deployment to GitHub Pages.

1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push changes to the `main` branch.
4. The Action will automatically build and deploy your application.

## 🛡️ Best Practices

- **.gitignore**: configured to exclude sensitive files (`.env`), build artifacts (`dist`), and system files.
- **Strict TypeScript**: configured for better type safety.
- **Linting**: configured with ESLint.

## 🔑 Environment Variables

Create a `.env` file based on your needs.
Example:
```
VITE_API_BASE_URL=...
```
**Note:** Do not commit `.env` files to version control.
