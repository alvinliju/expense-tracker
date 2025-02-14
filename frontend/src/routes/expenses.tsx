import { createFileRoute } from "@tanstack/react-router";
import { api } from "../lib/api";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/expenses")({
  component: expenses,
});

const getExpenses = async () => {
  const res = await api.expenses.$get();
  const data = res.json();
  console.log(data);
  return data;
};

function expenses() {
  const { isPending, data, error } = useQuery({
    queryKey: ["get-expenses"],
    queryFn: getExpenses,
  });

  return (
    <div className="w-full min-w-screen max-w-full">
      <Table className="max-w-3xl m-auto">
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
       
          <TableHead className="w-[100px]">Id</TableHead>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Amount</TableHead>
      
          </TableRow>
        </TableHeader>

        {/* loading skeleton on isPending */}
        {isPending && (
          <TableBody>
            <TableRow>
            <TableCell className="w-[100px]"><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell className="w-[100px]"><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-[250px]" /></TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="w-[100px]"><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell className="w-[100px]"><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-[250px]" /></TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="w-[100px]"><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell className="w-[100px]"><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-[250px]" /></TableCell>
            </TableRow>
          </TableBody>
        )}

        <TableBody>
          {data?.fakeExpenses.map((expenses) => (
            <TableRow key={expenses.id} >
              <TableCell className="font-medium">{expenses.id}</TableCell>
              <TableCell className="font-medium">{expenses.title}</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell className="text-right">${expenses.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
