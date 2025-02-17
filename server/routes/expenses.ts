import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator'
import {authMiddleware} from '../kinde'
import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import {eq, desc, sum, and} from 'drizzle-orm'

const expenseSchema = z.object({
    id:z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.string()
})

const createPostSchema = expenseSchema.omit({id:true})

type Expense = z.infer<typeof expenseSchema>
 
const fakeExpenses:Expense[] = [
    {id:1, title:"Netflix", amount:"199"},
    {id:2, title:"Wifi", amount:"499"},
    {id:3, title:"Water", amount:"200"}
]

export const expensesRoute = new Hono()
.get('/', authMiddleware, async (c) => {
    const user = await c.var.user
    console.log(user.id)
    const expenses = await db
    .select()
    .from(expensesTable)
    .where(eq(expensesTable.userId, user.id))
    .orderBy(desc(expensesTable.createdAt))
    .limit(100)
    return c.json({expenses})
})

.post('/',zValidator('json', createPostSchema),authMiddleware, async (c) => {
     //how we retrive data from requests and using zod for validation
    const expense = await c.req.valid('json')
    console.log(expense)
    const user = await c.var.user
    const results = await db.insert(expensesTable).values({
        ...expense,
        userId: user.id
    }).returning()
    return c.json(results)
})
.get('/:id{[0-9]+}', authMiddleware, async (c) => {
    const id = c.req.param('id')
    const user = await c.var.user
    console.log(user.id)
    const expense = await db
    .select()
    .from(expensesTable)
    .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
    .orderBy(desc(expensesTable.createdAt))
    .limit(1)
    .then(res => res[0])
    
    if(!expense){
        return c.notFound()
    }
    return c.json(expense)
})
.get('/total-spend', authMiddleware,async (c) => {
    const user = await c.var.user
    let result = await db.select({total: sum(expensesTable.amount)}).from(expensesTable).where(eq(expensesTable.userId, user.id)).limit(1).then(res => res[0])
    
    return c.json(result)
})
.delete('/:id{[0-9]+}', authMiddleware, async  (c) => {
    const id = c.req.param('id')
    const user = await c.var.user
    console.log(user.id)
    const expense = await db
    .delete(expensesTable)
    .returning()
    .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))


    if(!expense){
        return c.notFound()
    }
    
    return c.json({"message": "deleted succesfully"})
})
//.put