# Study Planner Frontend

A React application for generating personalized study plans.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment files:
   - Copy `.env.example` to `.env.development` for local development
   - Copy `.env.example` to `.env.production` for production (update API URL)

3. Start development server:
```bash
npm start
```

## Building for Production

```bash
npm run build
```

## Deployment to Netlify

1. Push your code to GitHub

2. In Netlify:
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Add environment variables:
     - `REACT_APP_API_URL`: Your Railway API URL

3. Deploy!

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL
  - Development: `http://localhost:5000`
  - Production: Your Railway API URL

## Available Scripts

- `npm start`: Run development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── StudyPlanForm.tsx
│   │   ├── StudyPlanTable.tsx
│   │   └── StudyPlanCalendar.tsx
│   ├── services/
│   │   └── api.ts
│   └── App.tsx
├── .env.example
├── netlify.toml
└── package.json
``` 