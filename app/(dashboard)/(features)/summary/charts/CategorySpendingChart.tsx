import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSearch, PieChart, Radar, Target } from "lucide-react";
import { useState } from "react";
import PieVariant from "./PieVariant";

interface ChartProps {
  data?: {
    name: string;
    totalSpent: number;
  }[];
}
const CategorySpendingChart = ({ data = [] }: ChartProps) => {
  const [chartVariant, setChartVariant] = useState("pie");

  const onVariantChange = (variant: string) => {
    setChartVariant(variant);
  };
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Categories</CardTitle>
        <Select defaultValue={chartVariant} onValueChange={onVariantChange}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Pie Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Radar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Radial Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data for this period.
            </p>
          </div>
        ) : (
          <>
            {chartVariant === "pie" && <PieVariant data={data} />}
            {/* {chartVariant === "radar" && <RadarVariant data={data} />} */}
            {/* {chartVariant === "radial" && <RadialVariant data={data} />}  */}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySpendingChart;
