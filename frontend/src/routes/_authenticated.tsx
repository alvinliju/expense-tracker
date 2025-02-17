import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { useNavigate } from '@tanstack/react-router'


const Login = () => {
   
    return (
        <div className='p-4 flex flex-col gap-4 '>
            <p>Login required</p>
            <a href="/api/login">
            <Button  className='max-w-[50px] hover:cursor-pointer' >Login</Button>
            </a>
        </div>
    )
}

const Component = () => {
    const {user} = Route.useRouteContext()
    if(!user){
        return <Login/>
    }
   return <Outlet/>
}


// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({context}) => {
        const queryClient = context.queryClient
    try{
        const data = await queryClient.fetchQuery(userQueryOptions)
        return data
    }catch(e){
        return {user:null}
    }
    
  },

  component: Component
})

