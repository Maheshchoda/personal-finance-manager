import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import AmountInput from "@/app/(dashboard)/components/AmountInput";
import DatePicker from "@/app/(dashboard)/components/DatePicker";
import { Select } from "@/app/(dashboard)/components/Select";
import useEditSheet from "@/components/hooks/useEditSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionSchema } from "@/drizzle/schema";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash } from "lucide-react";
import CapTrimEnd from "@/components/utilities/CapTrimEnd";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const transactionApiSchema = TransactionSchema.omit({ id: true });

type TransactionFormType = z.input<typeof formSchema>;
export type TransactionApiFormValues = z.input<typeof transactionApiSchema>;

interface Props {
  id?: string;
  defaultValues?: TransactionFormType;
  onSubmit: (values: TransactionApiFormValues) => void;
  onDelete?: (id: string) => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  onAccountCreation: (name: string) => void;
  categoryOptions: { label: string; value: string }[];
  onCategoryCreation: (name: string) => void;
}

const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  onAccountCreation,
  categoryOptions,
  onCategoryCreation,
}: Props) => {
  const { onClose, closeNewSheet } = useEditSheet();
  const form = useForm<TransactionFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: TransactionFormType) => {
    const amount = parseFloat(values.amount);
    const amountInMiliUnits = convertAmountToMiliUnits(amount);
    onSubmit({
      ...values,
      amount: amountInMiliUnits,
    });
    id ? onClose(id) : closeNewSheet();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
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
                  options={accountOptions}
                  onCreate={onAccountCreation}
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
                  options={categoryOptions}
                  onCreate={onCategoryCreation}
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
        <Button disabled={disabled} className="w-full">
          {id ? "Update Transaction" : "Create Transaction"}
        </Button>
        {id && onDelete && (
          <Button
            type="button"
            disabled={disabled}
            onClick={() => onDelete(id)}
            className="w-full"
            variant="outline"
          >
            <Trash className="mr-2 size-4" />
            Delete {`${CapTrimEnd("transactions", true)}`}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default TransactionForm;
