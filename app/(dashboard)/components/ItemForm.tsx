import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { AccountSchema, CategorySchema } from "@/drizzle/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

const schemas = {
  accounts: AccountSchema,
  categories: CategorySchema,
};

type SchemasType = typeof schemas;
type ItemName = keyof SchemasType;

const formSchema = (itemName: ItemName) => {
  return schemas[itemName].pick({ name: true });
};

export type FormType = z.input<ReturnType<typeof formSchema>>;

interface Props {
  itemName: ItemName;
  id?: string;
  defaultValues?: FormType;
  onSubmit: (values: FormType) => void;
  onDelete?: ({ id }: { id: string }) => void;
  disabled?: boolean;
}

const ItemForm = ({
  itemName,
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const schema = formSchema(itemName);
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const placeholder =
    itemName === "categories"
      ? "e.g. Food, Utilities, Entertainment"
      : "e.g. Cash, Bank Account, UPI.";

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
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={disabled} className="w-full">
          {id ? "Save" : `Create ${CapTrimEnd(itemName, true)}`}
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
            Delete {`${CapTrimEnd(itemName, true)}`}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ItemForm;
