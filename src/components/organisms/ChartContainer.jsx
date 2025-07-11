import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ChartContainer = ({ title, data, type = "line", className }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    const baseOptions = {
      chart: {
        type: type,
        background: "transparent",
        toolbar: {
          show: false,
        },
      },
      theme: {
        mode: "dark",
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 3,
      },
      xaxis: {
labels: {
          style: {
            colors: "#374151",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#374151",
          },
        },
      },
legend: {
        labels: {
          colors: "#374151",
        },
      },
tooltip: {
        theme: "light",
        style: {
          fontSize: "12px",
        },
      },
    };

    if (type === "line") {
      setChartOptions({
        ...baseOptions,
        stroke: {
          curve: "smooth",
          width: 3,
        },
        colors: ["#6366F1", "#8B5CF6", "#EC4899"],
        xaxis: {
          ...baseOptions.xaxis,
          categories: data.categories || [],
        },
      });
      setChartSeries(data.series || []);
    } else if (type === "bar") {
      setChartOptions({
        ...baseOptions,
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        colors: ["#6366F1", "#8B5CF6", "#EC4899"],
        xaxis: {
          ...baseOptions.xaxis,
          categories: data.categories || [],
        },
      });
      setChartSeries(data.series || []);
    } else if (type === "pie") {
      setChartOptions({
        ...baseOptions,
        colors: ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
        labels: data.labels || [],
        legend: {
          ...baseOptions.legend,
          position: "bottom",
        },
      });
      setChartSeries(data.series || []);
    }
  }, [data, type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("", className)}
    >
<Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Download" size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>
        
        <div className="h-80">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type={type}
            height="100%"
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default ChartContainer;