import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {api} from '@/lib/api'
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
})

async function getTotalSpend(){
  const res = await api.expenses['total-spend'].$get()
  if(!res.ok){
    throw new Error("server error")
  }
  const data = await res.json()
  return data
}

function Index() {
  const {isPending, error, data, isFetching}= useQuery({ queryKey: ['get-total-spend'], queryFn: getTotalSpend })

  if(error) return 'An error has occured: '+ error.message

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total spend</CardTitle>
          <CardDescription>The total amount you've spend</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{isPending ? "...." : data.total}</p>
        </CardContent>
      </Card>
    </>
  );
}

export default Index;
