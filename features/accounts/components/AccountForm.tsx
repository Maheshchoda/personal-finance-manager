import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { insertAccountsSchema } from "@/drizzle/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export const formSchema = insertAccountsSchema.pick({
  name: true,
});

export type FormType = z.input<typeof formSchema>;

interface Props {
  id?: string;
  defaultValues?: FormType;
  onSubmit: (values: FormType) => void;
  onDelete?: ({ id }: { id: string }) => void;
  disabled?: boolean;
}

const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormType) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g Cash, Bank, Credit Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={disabled} className="w-full">
          {id ? "Save" : "Create account"}
        </Button>
        {id && onDelete && (
          <Button
            type="button"
            disabled={disabled}
            onClick={() => onDelete({ id })}
            className="w-full"
            variant="outline"
          >
            <Trash className="mr-2 size-4" />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};

export default AccountForm;
