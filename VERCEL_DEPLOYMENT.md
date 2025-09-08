# Vercel Deployment Guide

This guide will help you deploy the Telegram Web App to Vercel with proper Tailwind CSS support.

## Prerequisites

- Vercel account
- GitHub/GitLab/Bitbucket repository with your project
- Node.js 18+ installed locally

## Deployment Steps

### 1. Prepare Your Project

Make sure your project has the following structure:

```
.
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── ...
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── vercel.json
```

### 2. Required Files

1. **tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

2. **postcss.config.js**
```javascript
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "npm run build:css && next build",
  "outputDirectory": ".next"
}
```

### 3. Environment Variables

Make sure to set these environment variables in your Vercel project:

```
NODE_ENV=production
```

### 4. Deploy to Vercel

1. Push your code to your Git repository
2. Import the repository to Vercel
3. Vercel will automatically detect the Next.js project
4. Make sure the build command is set to: `npm run build:css && next build`
5. Deploy!

## Troubleshooting

### Styles Not Loading

If styles are not loading in production:

1. Check the build logs for any CSS-related errors
2. Ensure `globals.css` is imported in your `app/layout.tsx`
3. Verify that the `build:css` script is running during build

### Build Failing

If the build fails:

1. Check the build logs in Vercel
2. Make sure all dependencies are installed
3. Ensure Node.js version is 18+
4. Check for any TypeScript or ESLint errors

## Additional Resources

- [Next.js on Vercel](https://nextjs.org/docs/deployment#vercel-recommended)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [Vercel Documentation](https://vercel.com/docs)
