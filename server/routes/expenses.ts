import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator'

const expenseSchema = z.object({
    id:z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive()
})

const createPostSchema = expenseSchema.omit({id:true})

type Expense = z.infer<typeof expenseSchema>
// the z.infer extracts the zod schema and create expense type based on that
/* type Expense = {
  id: number;
  title: string;
  amount: number;
} */ // This is how the Expense type looks like
 
const fakeExpenses:Expense[] = [
    {id:1, title:"Netflix", amount:199},
    {id:2, title:"Wifi", amount:499},
    {id:3, title:"Water", amount:200}
]

export const expenseRoute = new Hono()
.get('/', (c) => {
    return c.json({fakeExpenses})
})
.post('/',zValidator('json', createPostSchema), async (c) => {
     //how we retrive data from requests and using zod for validation
    const expense = await c.req.valid('json')
    console.log(expense)
    fakeExpenses.push({...expense, id:fakeExpenses.length+1})
    return c.json(expense)
})
.get('/:id{[0-9]+}', (c) => {
    const id = c.req.param('id')
    const expense = fakeExpenses.find((exp) => exp.id === Number(id))
    if(!expense){
        return c.notFound()
    }
    return c.json(expense)
})
.get('/total-spend', (c) => {
    let totalSpend:number = 0
    fakeExpenses.forEach((expense)=>{
        totalSpend += expense.amount
    })
    return c.json({"total": totalSpend})
})
.delete('/:id{[0-9]+}', (c) => {
    const id = c.req.param('id')
    const index = fakeExpenses.findIndex((exp) => exp.id === Number(id))
    if(!index){
        return c.notFound()
    }
    fakeExpenses.splice(index, 1)
    return c.json({"message": "deleted succesfully"})
})
//.put