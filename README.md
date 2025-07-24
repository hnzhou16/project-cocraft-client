# CoCraft - Social Platform to Design Better Homes Together

CoCraft is a social platform that brings together contractors, manufacturers, designers, and homeowners to share ideas,
collaborate on projects, and get inspired to create beautiful home spaces.

## Features

### User Accounts & Profiles

- **Authentication**: Sign up with real-time checks for email availability and password strength. Activate your account
  via an email link. Secure login with HTTP Only cookie.
- **User Roles & Profiles**: Create a personal profile and select your role - contractor, manufacturer, designer, or
  homeowner. View other users' profiles with role tags and ratings preview.
- **Ratings & Reviews**: Leave and read reviews on user profiles to build trust and credibility.

### Content Creation

- **Posts**: Create and view posts with text, images, tags, and user mentions.
- **AI Image Generator**: Generate AI-powered visuals to bring your design ideas to life and add them to your posts.
- **Cloud Storage**: Upload and store post images securely using AWS cloud.

### Interaction

- **Comments & Replies**: Create comments and reply on other comments.
- **Social Features**: Follow or unfollow users**, like or unlike posts, and mention others in the posts.

### Personalized Feed

- **Public Access**: Browse a limited public feed without an account.
- **User Feed**: Once logged in, access a personalized feed with infinite scroll.
- **Filters & Sorting**: Filter posts by followed users, mentions, and user roles. Sort by newest, most liked, or most
  commented.
- **Search**: Quickly find posts by keywords or tags.
- **Infinite Scrolling**: Smoothly load more content as you scroll across all major views.

### User Interface

- **Responsive Design**: Fully optimized for mobile and desktop devices.
- **Dark Mode**: UI automatically adapts to your system’s light or dark theme preference.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Backend**: Go with MongoDB (separate repository)

## Project Structure

```
project-cocraft-client/
├── app/                  # Next.js app directory
│   ├── actions/          # Server actions
│   ├── api/              # Server api
│   ├── create/           # Create post page
│   ├── generate-image/   # Generate AI image
│   ├── login/            # Login page
│   ├── logout/           # Logout page
│   ├── post/             # Post detail page
│   ├── profile/          # User profile page
│   ├── register/         # Register page
│   ├── error.tsx         # Error page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── loading.tsx       # Loading page
│   ├── not-found.tsx     # 404 page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── comment/          # Comment components
│   ├── feed/             # User feed components
│   ├── image/            # Carousel and image uploader components
│   ├── layout/           # Layout components
│   ├── post/             # Post components
│   ├── review/           # Review components
│   ├── ui/               # UI components
│   └── user/             # User components
├── mocks/                # Mocks components
├── providers/            # Context providers
├── public/               # Static assets
├── services/             # API services
├── store/                # Redux store
│   ├── slices/           # Redux slices
│   ├── hooks.ts          # Redux hooks
│   └── index.ts          # Store configuration
└── types/                # TypeScript types
└── utils/                # Api call helper and tailwind classnames
```