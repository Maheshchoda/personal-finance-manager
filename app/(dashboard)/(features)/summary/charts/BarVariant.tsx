import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import CustomToolTip from "./CustomToolTip";

interface BarVariantProps {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
}
const BarVariant = ({ data }: BarVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomToolTip />} />
        <Bar dataKey="income" className="drop-shadow-sm" fill="#3d82f6" />
        <Bar dataKey="expenses" className="drop-shadow-sm" fill="#f43f5e" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarVariant;
