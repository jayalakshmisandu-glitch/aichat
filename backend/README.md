# AI Chat Backend

ASP.NET Core backend for the Assignment 1 AI chat application.

## APIs

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/chat/send`

## Run

```powershell
cd backend
dotnet run
```

The API runs at `http://localhost:5146`.

## Notes

- Authentication uses an HTTP-only cookie.
- Users are stored in memory for the assignment base version.
- AI responses use Google Gemini.

## Deployment

This backend can be deployed without a database for the assignment demo.

For Render Docker deployment, use:

```text
Root Directory: backend
Dockerfile Path: Dockerfile
```

Set these environment variables on the hosting platform:

```text
FrontendUrl=https://YOUR-FRONTEND-URL
Gemini__ApiKey=YOUR_GEMINI_API_KEY
Gemini__Model=gemini-flash-lite-latest
```

After deployment, use the backend URL plus `/api` as the frontend API URL:

```text
VITE_API_URL=https://YOUR-BACKEND-URL/api
```
