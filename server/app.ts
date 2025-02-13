import { Hono } from "hono";
import { logger } from 'hono/logger'
import { expenseRoute } from "./routes/expenses";
import { serveStatic } from 'hono/bun'

const app = new Hono();

//logger 
app.use(logger())

app.route('/api/v1/expenses', expenseRoute)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './static/dist/index.html' }))


export default app;