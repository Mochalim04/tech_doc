# MPASI Pintar

## Overview
MPASI Pintar is an interactive Indonesian web application that helps parents find age-appropriate complementary baby food (MPASI) recipes based on available ingredients, child's age, and cooking time. The application features a beautiful, user-friendly interface designed for multi-generational use.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Node.js + Express
- **Data Storage**: In-memory storage (MemStorage) with pre-populated recipe database
- **State Management**: TanStack Query v5
- **Routing**: Wouter
- **Language**: Indonesian (Bahasa Indonesia)

### Key Features
1. **Recipe Search with Filters**
   - Ingredient-based search with tag system
   - Age range selection (6-24 months)
   - Cooking time filters

2. **Recipe Database**
   - 15 comprehensive Indonesian MPASI recipes
   - Age-appropriate categorization
   - Nutritional benefit information
   - YouTube video tutorials
   - Sourced from Kemenkes RI, IDAI, WHO guidelines

3. **User Experience**
   - Responsive design for all devices
   - Large fonts and touch targets for accessibility
   - Soft pastel color palette (sage green, warm cream, deep teal)
   - Beautiful hero section with illustrated banner
   - Recipe cards with images and badges

4. **Favorites System**
   - Local storage-based favorites
   - Persistent across sessions
   - Easy toggle functionality

### Pages & Routes
- `/` - Home page with hero section and features
- `/cari-resep` - Search page with filters
- `/resep` - Recipe listing with results
- `/resep/:id` - Recipe detail with full instructions and video
- `/favorit` - Saved favorite recipes

### API Endpoints
- `GET /api/recipes` - Get all recipes or search with filters (ingredients, age, time)
- `GET /api/recipes/:id` - Get single recipe by ID
- `GET /api/placeholder-image/:type` - Get placeholder images

### Recent Changes
- **2025-10-19**: Initial implementation
  - Created complete schema for Recipe model
  - Built all frontend components with Indonesian language
  - Implemented backend with 15 MPASI recipes
  - Added image generation for hero and recipe placeholders
  - Configured design system with Inter font and pastel colors

## Design Guidelines
The application follows the design guidelines in `design_guidelines.md`:
- Soft, warm color palette for trust and accessibility
- Large typography (Inter font) for multi-generational usability
- Generous spacing and high contrast for readability
- Minimal animations and straightforward interactions
- Educational disclaimers citing official sources

## Development
- **Start application**: The workflow runs `npm run dev` which starts both Express server and Vite dev server
- **Package management**: Use the packager tool to install dependencies
- **Testing**: E2e tests can be run via playwright for user journey validation

## Educational Sources
All recipes are based on official guidelines from:
- Kementerian Kesehatan Republik Indonesia (Kemenkes RI)
- Ikatan Dokter Anak Indonesia (IDAI)
- World Health Organization (WHO)

## Important Notes
- Recipes are for educational purposes only
- Not a replacement for medical consultation
- Users should consult pediatricians for specific dietary needs
- All recipes use natural ingredients without added sugar or salt
