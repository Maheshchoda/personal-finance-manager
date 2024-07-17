import CurrencyInput from "react-currency-input-field";

import { Info, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Props {
  value: string;
  placeholder: string;
  disabled: boolean;
  onChange: (value: string | undefined) => void;
}
const AmountInput = ({
  value: amount,
  placeholder,
  disabled,
  onChange,
}: Props) => {
  const parsedValue = parseFloat(amount);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;
  const toggleAmountSign = () => {
    if (!amount) return;
    const newValue = (parsedValue * -1).toString();
    onChange(newValue);
  };
  const getIcon = () => {
    if (!parsedValue) return <Info className="size-3 text-white" />;
    if (isIncome) return <PlusCircle className="size-3 text-white" />;
    if (isExpense) return <MinusCircle className="size-3 text-white" />;
  };
  const getButtonClassNames = () =>
    cn(
      "absolute left-1.5 top-1.5 flex items-center justify-center rounded-md bg-slate-400 p-2 transition hover:bg-slate-500",
      isIncome && "bg-emerald-500 hover:bg-emerald-600",
      isExpense && "bg-rose-500 hover:bg-rose-600",
    );
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleAmountSign}
              className={getButtonClassNames()}
            >
              {getIcon()}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Use [+] for Income and [-] for Expense.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        prefix="&#8377;"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        value={amount}
        decimalsLimit={2}
        decimalScale={2}
        onValueChange={onChange}
        disabled={disabled}
        intlConfig={{ locale: "en-IN", currency: "INR" }}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {isIncome && "This will count as Income."}
        {isExpense && "This will count as Expense."}
      </p>
    </div>
  );
};

export default AmountInput;
