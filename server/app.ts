import { Hono } from "hono";
import { logger } from 'hono/logger'
import { expensesRoute } from "./routes/expenses";
import { serveStatic } from 'hono/bun'
import { authRoute } from "./routes/auth";

const app = new Hono();

//logger 
app.use(logger())

const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute).route('/',authRoute)


//serving static files first
app.get('*', serveStatic({ root: './frontend/dist' }))

//SPA fallback for all the routes this allows the SPA to handle the routes internally
app.get('*', serveStatic({ path: './frontend/static/dist/index.html' }))



export type ApiRoutes = typeof apiRoutes

export default app;
