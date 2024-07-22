import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import CountUp from "react-countup";
import { IconType } from "react-icons";

type BoxVariantType = VariantProps<typeof boxVariant>;
type IconVariantType = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariantType, IconVariantType {
  title: string;
  value?: number;
  percentageChange?: number;
  dateRange: string;
  icon: IconType;
}

const DataCard = ({
  title,
  value = 0,
  percentageChange = 0,
  dateRange,
  icon: Icon,
  variant,
}: DataCardProps) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="mb-2 line-clamp-1 break-all text-2xl font-bold">
          <CountUp
            start={0}
            end={value}
            decimalPlaces={2}
            decimals={2}
            formattingFn={formatCurrency}
          />
        </h1>
        <p
          className={cn(
            "line-clamp-1 text-sm text-muted-foreground",
            percentageChange > 0 && "text-emerald-500",
            percentageChange < 0 && "text-rose-500",
          )}
        >
          {formatPercentage({ value: percentageChange, addPrefix: true })} from
          last period.
        </p>
      </CardContent>
    </Card>
  );
};

const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-emerald-500",
      danger: "fill-rose-500",
      warning: "fill-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export default DataCard;
