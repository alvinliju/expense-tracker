import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {api} from '@/lib/api'
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/create-expenses")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({json:value})
      if(!res.ok){
        throw new Error("server error")
      }

      navigate({to:'/expenses'})
      
    },
      
  });

  return (
    <div className="">
      <form
        className="max-w-xl m-auto p-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        
          <form.Field
            name="title"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Title</label>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors ? (
                  <p className="text-red-500 text-center" role="alert">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </>
            )}
          />

          <form.Field
            name="amount"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Amount</label>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange((e.target.value).toString())}
                />
                {field.state.meta.errors ? (
                  <p className="text-red-500 text-center" role="alert">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </>
            )}
          />
        
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="mt-4 items-center" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
