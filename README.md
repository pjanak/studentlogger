# StudentLogger - Domain Sales SPA

A modern React single-page application built with Vite to showcase and sell the premium domain **studentlogger.com**.

[![Deploy to AWS EC2](https://github.com/pjanak/studentlogger/actions/workflows/deploy-to-ec2.yml/badge.svg)](https://github.com/pjanak/studentlogger/actions/workflows/deploy-to-ec2.yml)

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

### Quick Start (Frontend Only)

```bash
npm install
npm run dev
```

Frontend opens at `http://localhost:3000`

### Full Setup (With Email & Form Submission)

**Terminal 1 - Frontend:**
```bash
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

**Setup Configuration:**
1. Copy `backend/.env.example` → `backend/.env`
2. Set up Gmail app password (see [SETUP.md](SETUP.md))
3. Update `ADMIN_EMAIL` in `backend/.env`

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