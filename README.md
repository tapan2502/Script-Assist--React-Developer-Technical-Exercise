# Script-Assist--React-Developer-Technical-Exercise

A modern web application for exploring characters, locations, and episodes from the Rick and Morty universe. This interactive application allows users to browse, search, and discover details about their favorite characters from the hit animated series.

## Features

- **Character Explorer**: Browse, search, and filter all characters from the show
- **Episode Showcase**: View episodes organized by season with detailed information
- **Character Comparison**: Compare any two characters side by side
- **Authentication System**: User registration and login functionality
- **Responsive Design**: Fully responsive UI that works on all devices
- **Interactive UI**: Engaging animations and transitions throughout the application
- **Favorites System**: Save your favorite characters for quick access

## Technologies Used

### Frontend:

- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **Mantine UI**: Component library for consistent design
- **Framer Motion**: Animation library for smooth transitions
- **React Router**: For navigation and routing
- **Zustand**: State management
- **Axios**: HTTP client for API requests
- **React Query**: Data fetching and caching
- **Rick and Morty API**: Data source for characters, episodes, and locations

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

## Key Features Explained

### Character Explorer

Browse through all characters from the show with advanced filtering and sorting options. View detailed information about each character including their status, species, origin, and episodes they appear in.

### Episode Showcase

Explore episodes organized by season. Each episode card displays the episode name, air date, character count, and popularity status. The showcase features a clean, visually appealing design with season tabs for easy navigation.

### Character Comparison

Select any two characters to compare their attributes side by side, including status, species, gender, origin, and episode appearances.

### Authentication System

Register and login functionality with secure authentication. Demo accounts are available for testing.

### Interactive UI

Engaging animations and transitions throughout the application, including a portal animation on the landing page, hover effects on cards, and smooth page transitions.

## Responsive Design

The application is fully responsive and works on all devices, from mobile phones to desktop computers.
## API Information

This project uses the Rick and Morty API, which provides data about characters, locations, and episodes from the show. The API is free to use and requires no authentication.

### Key endpoints used:

- `/character`: Get all characters or filter by parameters
- `/character/{id}`: Get a specific character by ID
- `/location`: Get all locations or filter by parameters
- `/episode`: Get all episodes or filter by parameters


## Acknowledgments

[Rick and Morty API](https://rickandmortyapi.com/) for providing the data
[Mantine UI](https://mantine.dev/) for the component library
[Framer Motion](https://www.framer.com/motion/) for animations
[React Query](https://react-query.tanstack.com/) for data fetching
[Zustand](https://github.com/pmndrs/zustand) for state management


