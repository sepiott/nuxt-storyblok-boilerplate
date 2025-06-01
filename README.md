# Nuxt + Storyblok Boilerplate

A modern website built with Nuxt 3 and Storyblok CMS, focusing on optimized performance, SEO, and responsive design.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
- [Code Standards & Linting](#code-standards--linting)
- [Build & Deployment](#build--deployment)
- [Storyblok Integration](#storyblok-integration)
  - [SEO Content Guidelines for Storyblok](#seo-content-guidelines-for-storyblok)
- [Contributing](#contributing)
- [License](#license)

## Features

- 📱 **Fully Responsive Design**: Built with Tailwind CSS for a seamless experience on all devices.
- 🖼️ **Optimized Images**: Leverages Nuxt Image for efficient image loading.
- 🚀 **High Performance**: Engineered for speed and optimal user experience.
- 🔍 **Comprehensive SEO**: Advanced SEO setup including dynamic meta tags, Open Graph, Twitter Cards, JSON-LD, and sitemap.
- 🧩 **Modular Architecture**: Component-based structure for maintainability and scalability.
- ⚡ **Advanced Caching Strategy**: Configurable static generation with options for ISR, SSG, or SSR based on content needs.

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Preline UI v3](https://preline.co/)
- **CMS**: [Storyblok](https://www.storyblok.com/) (Headless)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucid Icons](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18.17.0 or higher) - Required for Nuxt 3
- npm (v9.0.0 or higher) or yarn (v1.22.0 or higher)
- Git
- A Storyblok account (for CMS access)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- SSL certificates for local development (for dev-ssl script)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sepiott/nuxt-storyblok-boilerplate.git
    cd nuxt-storyblok-boilerplate
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file:
    ```bash
    touch .env
    ```
    Update `STORYBLOK_TOKEN` and `NUXT_PUBLIC_SITE_URL` in your `.env` file with your Storyblok API token and production site URL.

    Example `.env`:
    ```bash
    NUXT_PUBLIC_SITE_URL=https://your-site.com
    STORYBLOK_TOKEN=your_storyblok_access_token
    ```

### Development Server

Start the development server:

```bash
npm run dev
# or for Storyblok preview
npm run dev-ssl
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Standards & Linting

This project uses ESLint and Prettier for code quality and consistent formatting.

- **Lint**:
  ```bash
  npm run lint
  ```
- **Fix linting issues**:
  ```bash
  npm run lint:fix
  ```

## Build & Deployment

- **Generate static site for pre-rendering (SSG):**
  ```bash
  npm run generate
  ```
- **Preview the static build locally:**
  ```bash
  npm run preview
  ```
- **Build for production (with SSR or ISR capabilities):**
  ```bash
  npm run build
  ```

## Storyblok Integration

This project utilizes [Storyblok](https://www.storyblok.com/) as a headless CMS. Key features include:
- **Content Stages**: Support for draft and published content.
- **Visual Editor**: Real-time preview and editing capabilities.
- **Component Mapping**: Vue components are dynamically mapped to Storyblok components.
- **Asset Management**: Efficient handling of images and other assets via Storyblok.

### SEO Content Guidelines for Storyblok

To maximize SEO effectiveness when creating content in Storyblok:
1.  **Page Titles**: Keep between 50-60 characters, including the primary keyword.
2.  **Meta Descriptions**: Write compelling descriptions, 150-160 characters long.
3.  **Images**: Always provide descriptive alt text and use optimized image formats.
4.  **Content Structure**: Employ a logical heading hierarchy (H1, H2, H3, etc.).
5.  **URLs (Slugs)**: Use short, descriptive, keyword-rich slugs.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please ensure your code adheres to the project's linting and formatting standards.

## License

This project is licensed under the [MIT License](LICENSE.md). 

Feel free to use this boilerplate as a starting point for your own projects.
