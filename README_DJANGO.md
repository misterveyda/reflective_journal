# Reflective Journal

A reflective journal web application built with Django and Django REST Framework. Features include entry management, mood tracking, tagging, and AI-powered summaries.

## Features

- **Journal Entries**: Create, read, update, and delete journal entries
- **Mood Tracking**: Track emotional states across entries
- **Tagging**: Organize entries with custom tags
- **AI Summaries**: Generate summaries of entries for specific date ranges
- **User Authentication**: Multi-user support with Django's auth system
- **RESTful API**: Full API for frontend and offline app integration

## Tech Stack

- **Backend**: Python 3.10+, Django 4.2, Django REST Framework
- **Database**: PostgreSQL (production), SQLite (development)
- **Deployment**: Render
- **Server**: Gunicorn + WhiteNoise for static files

## Development Setup

### Prerequisites
- Python 3.10 or higher
- pip and virtualenv

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reflective_journal
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Copy environment variables:
```bash
cp .env.example .env
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

The server will be available at `http://localhost:8000`.

## API Endpoints

### Entries
- `GET /api/entries/` - List all entries (paginated)
- `POST /api/entries/` - Create a new entry
- `GET /api/entries/{id}/` - Get a specific entry
- `PUT /api/entries/{id}/` - Update an entry
- `DELETE /api/entries/{id}/` - Delete an entry
- `GET /api/entries/recent/` - Get entries from the last 7 days
- `POST /api/entries/summarize/` - Generate a summary for a date range

### Query Parameters
- `search` - Search in title, content, and tags
- `ordering` - Order by field (e.g., `-created_at` for newest first)
- `page` - Pagination (default 10 per page)

## Deployment to Render

1. Push your code to a GitHub repository
2. Connect the repository to Render via the dashboard
3. Configure environment variables:
   - `SECRET_KEY`: Generate a new Django secret key
   - `DEBUG`: Set to `False`
   - `ALLOWED_HOSTS`: Your Render domain
   - `DATABASE_URL`: Will be auto-configured if using PostgreSQL

4. Render will automatically:
   - Install dependencies
   - Run migrations
   - Collect static files

## Offline App (Upcoming)

The API is designed to support offline-first mobile and desktop applications using:
- Local data synchronization
- Conflict resolution
- Background sync

## Future Enhancements

- [ ] AI-powered entry summarization
- [ ] Offline-first React Native mobile app
- [ ] Desktop Electron app
- [ ] Entry analysis and insights
- [ ] Export options (PDF, JSON)
- [ ] Collaborative journaling
