# Script-Assist--React-Developer-Technical-Exercise

A modern web application for exploring characters, locations, and episodes from the Rick and Morty universe. This interactive application allows users to browse, search, and discover details about their favorite characters from the hit animated series.

## Features

- **Character Database**: Browse through hundreds of characters from the show
- **Advanced Search**: Filter and search characters by name, status, species, and gender
- **Character Details**: View comprehensive information about each character
- **Favorites System**: Save your favorite characters for quick access
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **User Authentication**: Secure login and registration system

## Technologies Used

### Frontend:

- React 18
- React Router v6
- Mantine UI Component Library
- TypeScript
- Tanstack React Query
- Lucide React Icons
- Zustand for state management

### API:

- Rick and Morty API (https://rickandmortyapi.com/)

## Installation

### Clone the repository:

```bash
git clone https://github.com/yourusername/rick-and-morty-explorer.git
cd rick-and-morty-explorer
```

### Install dependencies:

```bash
npm install
```

### Start the development server:

```bash
npm run dev
```

### Open your browser and navigate to:

```
http://localhost:5175
```

## Usage

### Authentication

The application includes a demo authentication system. You can use the following credentials:

- **Username**: admin
- **Password**: password

Or create a new account through the registration page.

### Exploring Characters

1. Log in to the application
2. Navigate to the Characters page
3. Browse through the character cards
4. Use the search bar to find specific characters
5. Click on a character card to view detailed information
6. Click the heart icon to add a character to your favorites

### Character Details

The character detail page provides comprehensive information about each character:

- Basic information (status, species, gender)
- Origin and current location
- Episodes the character appears in
- Related characters and locations

## Project Structure

```
rick-and-morty-explorer/
├── src/
│   ├── api/                 # API integration
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── characters/      # Character list and detail pages
│   │   └── landing/         # Landing page
│   ├── store/               # State management
│   ├── theme/               # Theme configuration
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
└── package.json             # Project dependencies
```
## Recent Enhancements
**Animated Portal Scene**: Interactive portal visualization on the landing page
**Character Comparison Tool**: Side-by-side comparison of any two characters
**Persistent Favorites**: Favorites system with localStorage persistence
**Real-time Search**: Instant search results as you type
**Animated UI Elements**: Smooth transitions and animations throughout the application
**Improved Mobile Experience**: Optimized layout and interactions for mobile devices
**Enhanced Character Cards**: Better visual presentation with status indicators and badges

## API Information

This project uses the Rick and Morty API, which provides data about characters, locations, and episodes from the show. The API is free to use and requires no authentication.

### Key endpoints used:

- `/character`: Get all characters or filter by parameters
- `/character/{id}`: Get a specific character by ID
- `/location`: Get all locations or filter by parameters
- `/episode`: Get all episodes or filter by parameters


## Acknowledgments

- Rick and Morty API for providing the data
- Mantine UI for the component library
- React Query for data fetching and caching
- Lucide React for the beautiful icons

