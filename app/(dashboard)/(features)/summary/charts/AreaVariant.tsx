import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import CustomToolTip from "./CustomToolTip";

interface AreaVariantProps {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
}
const AreaVariant = ({ data }: AreaVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomToolTip />} />
        <Area
          type="monotone"
          dataKey="income"
          stackId="income"
          stroke="#3d82f6"
          strokeWidth={2}
          className="drop-shadow-sm"
          fill="url(#incomeGradient)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          className="drop-shadow-sm"
          fill="url(#expensesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaVariant;
