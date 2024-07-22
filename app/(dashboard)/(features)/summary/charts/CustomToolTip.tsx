import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

const CustomToolTip = ({ active, payload }: any) => {
  if (!active) return null;

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expenses = payload[1].value;
  const adjustedExpenses = expenses > 0 ? expenses * -1 : 0;
  return (
    <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
      <div className="bg-muted p-2 px-3 text-muted-foreground">
        {format(date, "MM dd, yyyy")}
      </div>
      <Separator />
      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-blue-500" />
            <p className="text-sm text-muted-foreground">Income</p>
          </div>
          <p className="text-right text-sm font-medium">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-right text-sm font-medium">
            {formatCurrency(adjustedExpenses)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomToolTip;
