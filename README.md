# What's Happening Hub - Local Event Discovery Platform

A full-stack web application for discovering and managing local events in Nairobi, Kenya.

## 🚀 Features

- **Event Discovery**: Browse events by category, location, and date
- **User Authentication**: Email/password registration and login with JWT
- **Event Management**: Create, edit, and manage events
- **Categories**: Music, Sports, Technology, Food & Drink, Arts & Culture, Business, Networking
- **Real-time Search**: Filter events by location and category
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Shadcn UI** for components
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Django** 5.2.8
- **Django REST Framework** for API
- **Djoser** for authentication
- **SimpleJWT** for JWT tokens
- **SQLite** database (development)
- **CORS Headers** for cross-origin requests

## 📋 Prerequisites

- **Python** 3.12+
- **Node.js** 18+ and pnpm
- **Git**

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd what-s-happening-hub
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux

# Edit .env and add your SECRET_KEY (generate a new one for production!)

# Run migrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser

# (Optional) Seed database with sample Nairobi events
python manage.py seed_events

# Start development server
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Create .env file from example
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux

# Start development server
pnpm run dev
```

Frontend will run on `http://localhost:5173` or `http://localhost:8080`

## 🔐 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/users/` - Register new user
- `POST /api/auth/jwt/create/` - Login (get JWT tokens)
- `POST /api/auth/jwt/refresh/` - Refresh access token
- `GET /api/auth/users/me/` - Get current user

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create new event (authenticated)
- `GET /api/events/{id}/` - Get event details
- `PUT /api/events/{id}/` - Update event (owner only)
- `DELETE /api/events/{id}/` - Delete event (owner only)

### Categories
- `GET /api/categories/` - List all categories

## 🗄️ Database Seeding

To populate the database with sample Nairobi events:

```bash
cd backend
python manage.py seed_events
```

This creates 10 sample events across different categories with realistic Nairobi locations.

## 🔧 Development

### Backend
- Admin panel: `http://localhost:8000/admin/`
- API documentation: `http://localhost:8000/api/`

### Frontend
- Main app: `http://localhost:5173/`
- Hot reload enabled for development

## 📦 Project Structure

```
what-s-happening-hub/
├── backend/
│   ├── local_event/          # Django project settings
│   ├── users/                # Custom user model
│   ├── events/               # Events app
│   │   ├── models.py         # Event, Category, Ticket models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API views
│   │   └── management/       # Custom commands
│   │       └── commands/
│   │           └── seed_events.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── api/              # API client
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Deployment

### Backend (Django)
1. Set `DEBUG=False` in production
2. Generate a new `SECRET_KEY`
3. Configure production database (PostgreSQL recommended)
4. Set up static file serving
5. Use a production WSGI server (Gunicorn, uWSGI)

### Frontend (React)
1. Build production bundle: `pnpm run build`
2. Deploy `dist/` folder to hosting service
3. Update `VITE_API_BASE_URL` to production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Magdaline Muthui - Initial work

## 🙏 Acknowledgments

- Shadcn UI for beautiful components
- Django REST Framework for robust API
- Nairobi tech community for inspiration
