# Ai-Integrated Focus Learn

A comprehensive learning platform designed for distraction-free education. Create, manage, and share learning journeys with integrated video playback and note-taking capabilities.

## Navigation

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## About

Focus Learn is a modern educational platform that eliminates distractions commonly found on traditional video platforms like YouTube. It provides a clean, focused environment for learning with integrated note-taking capabilities, progress tracking, and community-driven content sharing.

### Key Benefits

- **Distraction-Free Learning**: Watch educational content without ads, comments, or suggested videos
- **Organized Learning Paths**: Create structured learning journeys for any subject
- **Integrated Note-Taking**: Take and manage notes directly alongside video content
- **Community Sharing**: Share and discover learning journeys from other users
- **Progress Tracking**: Visualize your learning progress with detailed analytics

## Features

### User Authentication
- Secure registration and login system
- JWT-based authentication
- Protected routes and user sessions

### Journey Management
- Create custom learning journeys
- Add individual YouTube videos or entire playlists
- Automatic chapter extraction from YouTube playlists
- Public/private journey visibility settings

### Video Player
- Clean, distraction-free video playback
- YouTube integration without distractions
- Chapter-based navigation
- Seamless video transitions

### Note-Taking System
- Rich text editor with formatting options
- Chapter-specific note organization
- Export notes as PDF
- Real-time note saving

### Community Features
- Explore public learning journeys
- Fork others' journeys to customize for personal use
- Share your own learning paths with the community
- User-generated content discovery

### Progress Analytics
- Visual progress tracking with charts
- Learning statistics and insights
- Journey completion tracking
- Personal dashboard with analytics

## Screenshots

### Authentication
![Login Page](image/Screenshot%202025-12-05%20110508.png)

### Journey Creation
![Create Journey](image/Screenshot%202025-12-05%20110516.png)

### Learning Interface
![Journey Page](image/Screenshot%202025-12-05%20110542.png)

### Video Player & Notes
![Video Player](image/Screenshot%202025-12-05%20110553.png)

### Progress Tracking
![Progress Charts](image/Screenshot%202025-12-05%20110600.png)

### Community Exploration
![Explore Community](image/Screenshot%202025-12-05%20110621.png)

## Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router DOM** - Client-side routing and navigation
- **Chart.js** - Data visualization for progress tracking
- **React Quill** - Rich text editor for note-taking
- **Headless UI** - Accessible, unstyled UI components

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database management system
- **JWT** - JSON Web Tokens for secure authentication
- **bcrypt** - Password hashing for security
- **YouTube API v3** - Video and playlist integration
- **Google Generative AI** - AI-powered content enhancement

### Development Tools
- **ESLint** - Code linting and style enforcement
- **PostCSS** - CSS processing and optimization
- **Nodemon** - Development server with auto-restart

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vashishta-varma/ai-integrated-focus-learn.git
   cd ai-integrated-focus-learn
   ```

2. **Backend Setup**
   ```bash
   cd api
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Configure your environment variables in .env
   # DB_HOST=localhost
   # DB_USER=your_username
   # DB_PASSWORD=your_password
   # DB_NAME=focus_learn
   # JWT_SECRET=your_jwt_secret
   # YOUTUBE_API_KEY=your_youtube_api_key
   ```

3. **Database Setup**
   ```bash
   # Import the database schema
   mysql -u your_username -p focus_learn < table.sql
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Start Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd api
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=focus_learn
JWT_SECRET=your_jwt_secret_key
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
PORT=5000
```

## Usage

### Getting Started

1. **Register/Login**
   - Visit `/auth` to create an account or login
   - Secure authentication with JWT tokens

2. **Create Your First Journey**
   - Click "Create New Journey" on the dashboard
   - Add a title, description, and set visibility
   - Add YouTube videos or paste a playlist URL

3. **Start Learning**
   - Click on any journey to begin
   - Use the distraction-free video player
   - Take notes in real-time with the rich text editor

4. **Explore Community**
   - Visit the `/explore` page to discover public journeys
   - Fork interesting journeys to your account
   - Customize forked journeys to your needs

5. **Track Progress**
   - View your learning analytics on the profile page
   - Monitor completion rates and time spent learning

## API Documentation

### Authentication Endpoints

**POST** `/api/auth/register`
- Register a new user account
- Body: `{ "username", "email", "password" }`

**POST** `/api/auth/login`
- Authenticate user and receive JWT token
- Body: `{ "email", "password" }`

### Journey Endpoints

**GET** `/api/journeys`
- Retrieve user's journeys (requires authentication)

**POST** `/api/journeys`
- Create a new learning journey
- Body: `{ "title", "description", "isPublic" }`

**POST** `/api/journeys/:id/fork`
- Fork a public journey to your account

### Chapter Endpoints

**GET** `/api/journeys/:journeyId/chapters`
- Get all chapters for a specific journey

**POST** `/api/chapters`
- Add a new chapter to a journey
- Body: `{ "title", "description", "videoLink", "journeyId" }`

### Note Endpoints

**POST** `/api/notes`
- Create a new note
- Body: `{ "content", "chapterId", "journeyId" }`

**GET** `/api/journeys/:journeyId/notes`
- Get all notes for a specific journey

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow existing code conventions
- Use meaningful commit messages
- Add comments for complex logic
- Ensure all tests pass

## Bug Reports & Feature Requests

Please use [GitHub Issues](https://github.com/vashishta-varma/ai-integrated-focus-learn/issues) to report bugs or request features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons from [Flaticon](https://www.flaticon.com/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)
- Video integration powered by [YouTube API](https://developers.google.com/youtube)

## Support

If you find this project helpful, please star the repository!

For support and questions:
- Create an [Issue](https://github.com/vashishta-varma/ai-integrated-focus-learn/issues)
- Contact: [Your Email](mailto:your.email@example.com)

---

<div align="center">
  <p>Made with care by the Focus Learn Team</p>
  <p>© 2024 Focus Learn. All rights reserved.</p>
</div>