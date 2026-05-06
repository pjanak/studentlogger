# StudentLogger - Domain Sales SPA

A modern React single-page application built with Vite to showcase and sell the premium domain **studentlogger.com**.

## Features

- **React 18** - Modern component-based architecture
- **Vite** - Fast build tool and dev server
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Smooth Navigation** - Client-side routing with smooth scrolling
- **Contact Form** - Allow interested buyers to submit inquiries
- **Component-Based** - Easy to extend with new features
- **Modern UI** - Clean, professional design with gradient backgrounds

## Project Structure

```
studentlogger/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── Hero.jsx        # Hero section
│   │   ├── About.jsx       # About section
│   │   ├── Value.jsx       # Value proposition cards
│   │   ├── Uses.jsx        # Use cases
│   │   ├── Contact.jsx     # Contact form
│   │   └── Footer.jsx      # Footer
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The site will open at `http://localhost:3000` with hot reloading enabled.

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Sections

1. **Navigation Bar** - Smooth navigation between sections
2. **Hero Section** - Eye-catching domain display with CTAs
3. **About** - Description of why the domain is valuable
4. **Value Proposition** - 6 key reasons to buy
5. **Use Cases** - 6 ideal applications for the domain
6. **Contact Form** - Collect buyer inquiries
7. **Footer** - Copyright info

## Adding Features

Edit React components in `src/components/` to customize content or add new features. All styling is in `src/index.css`.

## Deployment

Build the app and deploy the `dist/` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Connect to GitHub and auto-deploy
- **AWS S3 + CloudFront**: See deployment guide
- **Any static host**: Just upload the `dist/` folder