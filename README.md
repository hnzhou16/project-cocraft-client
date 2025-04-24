# CoCraft - Social Platform for Creators

CoCraft is a social platform that connects creators and users, allowing them to share their work, get inspired, and build a community.

## Features

- **User Authentication**: Register, login, and manage user accounts
- **User Profiles**: View and edit user profiles, follow other users
- **Posts**: Create, view, update, and delete posts with support for text, images, and tags
- **Feed**: Personalized feed based on followed users and mentions
- **Comments**: Comment on posts and reply to other comments
- **Reviews**: Leave reviews for other users
- **Categories**: Browse posts by tags and categories
- **Trending**: Discover trending posts sorted by likes, comments, or recency
- **Explore**: Find and connect with other creators and users

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS 4
- **API Communication**: Axios
- **Backend**: Go with MongoDB (separate repository)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Go 1.20+ (for backend)
- MongoDB (for backend)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-cocraft-client.git
   cd project-cocraft-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

The backend code is available in the [project-cocraft-server](https://github.com/yourusername/project-cocraft-server) repository. Follow the instructions in that repository to set up the backend.

## Project Structure

```
project-cocraft-client/
├── app/                  # Next.js app directory
│   ├── categories/       # Categories page
│   ├── create/           # Create post page
│   ├── explore/          # Explore users page
│   ├── feed/             # User feed page
│   ├── login/            # Login page
│   ├── logout/           # Logout page
│   ├── post/             # Post detail page
│   ├── profile/          # User profile page
│   ├── register/         # Register page
│   ├── trending/         # Trending posts page
│   ├── error.tsx         # Error page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── loading.tsx       # Loading page
│   ├── not-found.tsx     # 404 page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── comment/          # Comment components
│   ├── layout/           # Layout components
│   ├── post/             # Post components
│   ├── review/           # Review components
│   └── user/             # User components
├── providers/            # Context providers
├── public/               # Static assets
├── services/             # API services
├── store/                # Redux store
│   ├── slices/           # Redux slices
│   ├── hooks.ts          # Redux hooks
│   └── index.ts          # Store configuration
└── types/                # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
