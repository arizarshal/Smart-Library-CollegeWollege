# Smart Library Borrowing System - AI Coding Instructions

## Architecture Overview
This is a **vanilla JavaScript frontend + Express/MongoDB backend** library management system. The core business logic enforces **one active borrow per user** with automatic overdue calculation and payment tracking.

### Critical Business Rules
- Users can only borrow **one book at a time** (enforced in `services/borrow.service.js`)
- Books have `isBorrowed` flag updated transactionally during borrow/return
- **Overdue fees** calculated as `Math.ceil((returnDate - dueDate) / (1000*60*60*24)) * book.duePerDay`
- Payment records are **always PENDING** (simulated payment system)
- User `balance` accumulates total dues (updated on book return in `submitBorrowService`)

### Data Flow Pattern
**Borrow Flow**: Controller → Service (business logic + validation) → Model (Mongoose) → Database
- Services throw `Error` with optional `err.statusCode` (caught by global error handler)
- Controllers should NOT have try/catch when using `catchAsync` wrapper (from `utils/AppError.js`)
- Use `createBorrowService`, `submitBorrowService`, etc. from `services/borrow.service.js` — do NOT duplicate logic in controllers

## Project Structure
```
backend/
  ├── controllers/     # Route handlers (thin layer, delegates to services)
  ├── services/        # Business logic, validation, transactions
  ├── models/          # Mongoose schemas with validators
  ├── middleware/      # auth, error handling, rate limiting, logging tags
  ├── routes/          # Express routers with middleware chains
  └── utils/           # AppError, catchAsync, loggers
client/
  ├── js/              # Vanilla JS modules (auth, api, page-specific)
  ├── partials/        # navbar.html (HTML fragment, NO <html>/<head> tags)
  └── *.html           # Pages load scripts: config.js → api.js → auth.js → page.js → navbar.js
```

## Development Workflow

### Backend Commands
```bash
cd backend
npm install
npm run dev          # nodemon server.js (port 5000)
```

### Frontend
- Use Live Server on `client/` folder only (configured in `.vscode/settings.json`)
- **Never serve from workspace root** — logs in `backend/storage/logs/` trigger reload loops
- Frontend served on `http://127.0.0.1:5502` (Live Server) talks to backend on `http://localhost:5000`

### Environment Variables
Required in `backend/.env`:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
PORT=5000
NODE_ENV=development
```

## Key Conventions

### Error Handling Pattern
**Services**: Throw `Error` with optional `.statusCode` property
```javascript
const err = new Error("Book not found");
err.statusCode = 404;
throw err;
```

**Controllers**: Use `catchAsync` wrapper (NO manual try/catch)
```javascript
import { catchAsync } from "../utils/AppError.js";

export const getBorrow = catchAsync(async (req, res) => {
  const result = await getBorrowService(req.user.id);
  return res.status(200).json(result);
});
```

**Global Handler** (`middleware/errorHandler.js`): Normalizes errors, logs to controller-specific files via `req._controllerName`

### Authentication Flow
1. `authRoutes.js` applies `authMiddleware` to protected routes
2. Middleware verifies JWT from `Authorization: Bearer <token>` header
3. Attaches `req.user = { id, role }` for downstream use
4. Frontend stores token in `localStorage` (set by `client/js/auth.js`)

### Logging System
- **Request logs**: `backend/storage/logs/logs.txt` (2xx/3xx only, via morgan)
- **Error logs**: `backend/storage/logs/errors.txt` (4xx/5xx, via morgan + errorHandler)
- **Controller logs**: `backend/storage/logs/<controllerName>.log` (all levels, JSON lines)
  - Use `createControllerLogger("controllerName")` in controllers
  - Routes must call `tagController("controllerName")` to set `req._controllerName`

### Frontend Module Loading
**Critical**: Scripts MUST load in this order (see `client/profile.html` for reference):
```html
<script src="js/config.js"></script>      <!-- API_BASE_URL config -->
<script src="js/api.js"></script>         <!-- apiFetch() wrapper -->
<script src="js/auth.js"></script>        <!-- logout(), token helpers -->
<script src="js/<page>.js"></script>      <!-- Page-specific logic -->
<script src="js/navbar.js"></script>      <!-- Injects navbar (runs last) -->
```

**Navbar Pattern**: `partials/navbar.html` is an HTML fragment (no doctype/html/body). `navbar.js` fetches it and injects via `insertAdjacentHTML("afterbegin", ...)`. Never include `<script>` tags in partials.

## Common Patterns

### Pagination (Books API)
```javascript
// Backend: services/book.service.js
const books = await Book.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 });
// Returns: { data: [...], pagination: { page, limit, totalItems, totalPages } }
```

### Aggregation (Analytics)
See `services/borrow.analytics.service.js` for MongoDB aggregation pipeline pattern (group by bookId, lookup Book details, sort by count).

### Transaction Pattern (Book Return)
In `submitBorrowService`:
1. Update borrow status to RETURNED
2. Create PENDING payment
3. Mark book as available (`isBorrowed: false`)
4. Increment user balance
(Note: Currently NOT using Mongoose sessions — consider adding for ACID guarantees)

## Integration Points

### External Dependencies
- **MongoDB Atlas**: Cloud database (see `config/db.js`)
- **Render.com**: Hosting (frontend + backend deployed separately)
- **Postman**: API docs at https://documenter.getpostman.com/view/18322190/2sBXVfjrnq

### CORS Configuration
Development: Allows all origins (`process.env.NODE_ENV !== "production"`)
Production: Whitelist in `app.js` (currently `127.0.0.1:5501`, `localhost:5501`)

### Rate Limiting
- Auth endpoints: 20 requests/15min (`authLimiter`)
- General API: 100 requests/15min (`apiLimiter`, currently commented out)

## Testing Approach
- No automated test suite currently
- Manual testing via Postman (see docs link above)
- Frontend testing via Live Server + browser console

## Common Gotchas
1. **Circular imports**: Keep models, services, controllers separate. Models import nothing except Mongoose.
2. **Forgot await**: Always `await` service calls and `.json()` in frontend
3. **Missing `req.user`**: If auth fails silently, check `authMiddleware` is applied in route
4. **Duplicate script execution**: Navbar injection can cause scripts to re-run if partial has `<script>` tags
5. **Log reload loops**: Never write logs to `backend/public/` — use `backend/storage/logs/`
6. **Pagination response shape changed**: Backend returns `{ data, pagination }` not raw array
7. **Frontend script order**: Config → API → Auth → Page → Navbar (see module loading section)

## When Adding Features
- **New route**: Add to `routes/`, apply `authMiddleware` + `tagController("name")`, delegate to controller
- **Business logic**: Put in `services/`, throw errors with `.statusCode`, use in controller via `catchAsync`
- **New model**: Add indexes for frequently queried fields (`userId`, `bookId`, `status`)
- **Frontend page**: Follow existing script load order, handle `{data, pagination}` response shape
- **Logging**: Use `createControllerLogger("name")` in controllers, call `log.info/warn/error/debug(req, message, meta)`
