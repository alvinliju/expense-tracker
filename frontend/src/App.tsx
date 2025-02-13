import "./index.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

function App() {
  const [totalSpend, setTotalSpend] = useState(0)

  useEffect(()=>{
    async function fetchTotal() {
      const res = await fetch('/api/v1/expenses/total-spend')
      let data = await res.json()
      setTotalSpend(data.total)
    }
    fetchTotal()
  },[])


  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total spend</CardTitle>
          <CardDescription>The total amount you've spend</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{totalSpend}</p>
        </CardContent>
      </Card>
    </>
  );
}

export default App;
