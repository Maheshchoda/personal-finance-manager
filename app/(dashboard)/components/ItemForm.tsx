import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  AccountSchema,
  CategorySchema,
  TransactionSchema,
} from "@/drizzle/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import { ItemType } from "@/components/entities/ItemType";
import { Textarea } from "@/components/ui/textarea";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { z } from "zod";
import AmountInput from "./AmountInput";
import DatePicker from "./DatePicker";
import { Select } from "./Select";

const TransactionFormValueSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const accountSchema = z.object({
  name: z.string(),
});

const categorySchema = z.object({
  name: z.string(),
});

export type TransactionFormValues = z.infer<typeof TransactionFormValueSchema>;
export type AccountFormValues = z.infer<typeof accountSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;

// Create a union type
export type FormValueSchemaType =
  | TransactionFormValues
  | AccountFormValues
  | CategoryFormValues;

function getFormValueSchema<T extends ItemType>(itemName: T) {
  if (itemName === "transactions") {
    return TransactionFormValueSchema;
  } else if (itemName === "accounts") {
    return accountSchema;
  } else {
    return categorySchema;
  }
}

const formSubmitSchema = {
  transactions: TransactionSchema.omit({ id: true }),
  accounts: AccountSchema.pick({ name: true }),
  categories: CategorySchema.pick({ name: true }),
};

export type FormSubmitType<T extends ItemType> = z.input<
  (typeof formSubmitSchema)[T]
>;

interface BaseFormProps<T extends ItemType> {
  itemName: T;
  onSubmit: (values: FormSubmitType<T>) => void;
  disabled: boolean;
  defaultValues: FormValueSchemaType;
  accountOptions?: { label: string; value: string }[];
  onAccountCreation?: (name: string) => void;
  categoryOptions?: { label: string; value: string }[];
  onCategoryCreation?: (name: string) => void;
}

interface CreateFormProps<T extends ItemType> extends BaseFormProps<T> {
  mode: "create";
}

interface UpdateFormProps<T extends ItemType> extends BaseFormProps<T> {
  mode: "update";
  id: string;
  onDelete: ({ id }: { id: string }) => void;
}

type Props<T extends ItemType> = CreateFormProps<T> | UpdateFormProps<T>;

const ItemForm = <T extends ItemType>(props: Props<T>) => {
  const { itemName, defaultValues, disabled, onSubmit } = props;

  const form = useForm<FormValueSchemaType>({
    resolver: zodResolver(getFormValueSchema(itemName)),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValueSchemaType) => {
    if (itemName === "transactions") {
      const transaction = values as TransactionFormValues;
      const amount = parseFloat(transaction.amount);
      const amountInMiliUnits = convertAmountToMiliUnits(amount);
      onSubmit({ ...values, amount: amountInMiliUnits } as FormSubmitType<T>);
    } else {
      onSubmit(values as FormSubmitType<T>);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        {itemName === "transactions" ? (
          <>
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={field.disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="payee"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payee</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={disabled}
                      placeholder="Add a payee"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="accountId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <FormControl>
                    <Select
                      placeholder={"Select an account"}
                      options={props.accountOptions}
                      onCreate={props.onAccountCreation}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      placeholder={"Select an category"}
                      options={props.categoryOptions}
                      onCreate={props.onCategoryCreation}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <AmountInput
                      {...field}
                      disabled={disabled}
                      placeholder="0.00"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="notes"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={disabled}
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Add notes"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        ) : (
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder={
                      itemName === "accounts"
                        ? "e.g. Cash, Bank Account, UPI."
                        : "e.g. Food, Utilities, Entertainment."
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button disabled={disabled} className="w-full">
          {props.mode === "update" && props.id
            ? "Save"
            : `Create ${CapTrimEnd(itemName, true)}`}
        </Button>
        {props.mode === "update" && props.id && props.onDelete && (
          <Button
            type="button"
            disabled={disabled}
            onClick={() => props.onDelete({ id: props.id })}
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
