# Wordle-Like Game

A full-stack word guessing game built with Angular and Flask.

> Built in under 24 hours, to fit with the game spirit. 

## Live Demo

 [https://worlde-like.vercel.app](https://worlde-like.vercel.app)

## Features

- Daily word puzzle with 24-hour rotation
- Animated letter reveals with color-coded feedback
- Interactive keyboard tracking
- Local progress persistence
- Rate limiting and input validation
- Responsive design

## Tech Stack

### Frontend
- Angular 18+ with Standalone Components
- SCSS
- Deployed on Vercel

### Backend
- Flask (Python)
- Flask-CORS
- File-based persistence
- Deployed on PythonAnywhere

## Installation

## Installation

### Frontend

```bash
cd client
npm install
ng serve
```

Access at `http://localhost:4200`

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install flask flask-cors
python app.py
```

Add a `words.txt` file with 5-letter words (one per line). Server runs on `http://localhost:5000`

## Deployment

### Vercel (Frontend)
Build settings:
- Build Command: `ng build --configuration production --base-href /`
- Output Directory: `dist/client/browser`

### PythonAnywhere (Backend)
1. Upload `app.py` and `words.txt`
2. Install dependencies in bash console
3. Configure WSGI and reload

## Configuration

Update API endpoint in `client/src/app/app.component.ts`:
```typescript
this.http.post<ServerResponse>('YOUR_BACKEND_URL/validate', { word })
```

Update CORS in `server/app.py`:
```python
CORS(app, origins=["YOUR_FRONTEND_URL"])
```

## License

MIT
