# backend

## dev journal

- how hono works(kinda).
- setInterval cant delay response coz http is stateless .
- we can keep the connection alive and keep sending data using SSE, websockets, polling.
- `const expenses: Expense[] = [];` works but `const expenses: Expense = [];` this doesnt why?

  - its because when we say this `:Expense[] = []` we are saying array of objects
  - when we do this `:Expense = []` we are saying one single object of type `Expense`.

- using zod for input validation =>

  - the first question that i asked was, why not use ts types or interfaces to validate but ts is just for compile time validation THATS it..

  - whenever we parse data from the req it'll always be a string so if we are comparing id or something which might be a number we should typecast it before comparison.

- CSR SPA and all our react code will be running in `localhost:5173` right? and our backend is `localhost:3000` so if we wanna consume the backend api running on `localhost:3000` without any CORS issues we make this change in the `vite.config.ts`

```javascript
``proxy:{
      '/api':{
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }`
``
```

- Understanding Hono RPC:
  - Hono RPC (Remote Procedure Call) allows type-safe API calls between client and server
  - How it works:
    1. Define your API routes and types on the server side
    2. Export these types (usually in a shared types file)
    3. Create a client using `hc<ApiRoutes>('/')`
    4. The client automatically gets type hints for all API endpoints
    5. TypeScript ensures the request and response types match the server definitions
  - Example:
  
    ```typescript
    // Server
    app.post('/api/expenses', async (c) => {
      // TypeScript knows the shape of the request body
      return c.json({ success: true })
    })

    // Client
    const client = hc<ApiRoutes>('/')
    // TypeScript knows the response type
    const response = await client.api.expenses.$post({ 
      json: { amount: 100 } 
    })
    
    - you can only use a hook inside a component 