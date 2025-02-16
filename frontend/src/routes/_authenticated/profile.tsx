import { createFileRoute } from '@tanstack/react-router'
import { userQueryOptions} from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { any } from 'zod';

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})



function RouteComponent() {
  const { isLoading, data, error } = useQuery(userQueryOptions);
  
  console.log('API Response:', data); // Log the entire response
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div><p>Not logged in</p></div>;

  return (
      <div>
          <h1>Welcome to profile</h1>
          {!data.user ? <p>Not logged in</p> : <p>Username: {data.user?.family_name}</p>}
      </div>
  )
}