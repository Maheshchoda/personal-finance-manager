import { ItemType } from "@/components/entities/ItemType";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";
import {
  AccountSchema,
  CategorySchema,
  TransactionSchema,
} from "@/drizzle/schema";
import { convertAmountToMilliUnits } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AmountInput from "./AmountInput";
import DatePicker from "./DatePicker";
import { Select } from "./Select";

const TransactionFormSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const AccountFormSchema = z.object({
  name: z.string(),
});

const CategoryFormSchema = z.object({
  name: z.string(),
});

export type TransactionFormValues = z.infer<typeof TransactionFormSchema>;
export type AccountFormValues = z.infer<typeof AccountFormSchema>;
export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

// Union type for form values
export type FormValues =
  | TransactionFormValues
  | AccountFormValues
  | CategoryFormValues;

function getFormSchema<T extends ItemType>(itemType: T) {
  switch (itemType) {
    case "transactions":
      return TransactionFormSchema;
    case "accounts":
      return AccountFormSchema;
    case "categories":
      return CategoryFormSchema;
    default:
      throw new Error(`Unknown item type: ${itemType}`);
  }
}
const FormSubmissionSchemas = {
  transactions: TransactionSchema.omit({ id: true }),
  accounts: AccountSchema.pick({ name: true }),
  categories: CategorySchema.pick({ name: true }),
};

export type FormSubmitValues<T extends ItemType> = z.input<
  (typeof FormSubmissionSchemas)[T]
>;

interface BaseFormProps<T extends ItemType> {
  itemType: T;
  onSubmit: (values: FormSubmitValues<T>) => void;
  disabled: boolean;
  defaultValues: FormValues;
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
  const { itemType, defaultValues, disabled, onSubmit } = props;
  console.log(props, "From the props");

  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(itemType)),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    if (itemType === "transactions") {
      const transactionValues = values as TransactionFormValues;
      const amount = parseFloat(transactionValues.amount);
      const amountInMilliUnits = convertAmountToMilliUnits(amount);
      onSubmit({
        ...values,
        amount: amountInMilliUnits,
      } as FormSubmitValues<T>);
    } else {
      onSubmit(values as FormSubmitValues<T>);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        {itemType === "transactions" ? (
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
                      placeholder="Select an account"
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
                      placeholder="Select a category"
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
                      {...field}
                      disabled={disabled}
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
                    {...field}
                    disabled={disabled}
                    placeholder={
                      itemType === "accounts"
                        ? "e.g. Cash, Bank Account, UPI."
                        : "e.g. Food, Utilities, Entertainment."
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <Button disabled={disabled} className="w-full">
          {props.mode === "update" && props.id
            ? "Save"
            : `Create ${CapTrimEnd(itemType, true)}`}
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
            Delete {`${CapTrimEnd(itemType, true)}`}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ItemForm;
