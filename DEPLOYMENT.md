# Deployment Guide (Render + Vercel)

## 1) Deploy Backend on Render

1. In Render, create a new Web Service from this repo.
2. Render will detect [render.yaml](render.yaml) automatically.
3. The Blueprint will create the PostgreSQL database (`app-cafet-db`) automatically and wire credentials to the backend.
4. In the service settings, set only this required variable manually:
   - `APP_CORS_ALLOWED_ORIGINS` (set this to your Vercel domain, for example `https://your-app.vercel.app`)
5. Trigger deploy.
6. Verify health: `https://<your-render-service>.onrender.com/api/auth/users`

## 2) Deploy Frontend on Vercel

1. Import the same repo in Vercel.
2. Set project root to `cafeteria-app`.
3. Vercel will use [cafeteria-app/vercel.json](cafeteria-app/vercel.json).
4. Ensure production API URL is correct in [cafeteria-app/src/environments/environment.production.ts](cafeteria-app/src/environments/environment.production.ts).
5. Deploy and verify login + create sale + order flow.

## 3) Final CORS Check

After Vercel gives your final domain, update `APP_CORS_ALLOWED_ORIGINS` on Render if needed and redeploy backend.

## Notes

- Backend listens on `PORT` automatically.
- PostgreSQL driver is included in backend runtime dependencies.
- Docker startup converts Render `DATABASE_URL` to Spring `SPRING_DATASOURCE_URL` automatically.
- H2 console is disabled in production via environment variables.
