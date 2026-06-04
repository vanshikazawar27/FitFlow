# TODO: Fix login/register connection refused (backend crashes)

## What we know
- Frontend calls `http://localhost:5000/api/auth/login` and `/register`.
- Browser shows `ERR_CONNECTION_REFUSED` -> backend is not listening on TCP 5000 at time of request.
- Backend process starts then crashes (nodemon app crashed message).

## Immediate code issues
- `authController.js` requires `../models/User` but schema file appears as `models/user.js` (case mismatch).
  - On case-sensitive FS this will crash.
- `config/db.js` calls `process.exit(1)` if `MONGO_URI` is missing/invalid.
- `JWT_SECRET` must exist for jwt.sign/verify.

## Steps
1. Normalize model import:
   - Update `Backend/controllers/authController.js` to require `../models/user` (or rename file to `User.js`).
2. Restart backend and confirm it stays running.
3. Verify `.env` variables exist:
   - `MONGO_URI`, `JWT_SECRET`, optionally `PORT`.
4. If still crashing, capture the exact backend crash stack trace and fix root cause.
5. Retry login/register from frontend.

