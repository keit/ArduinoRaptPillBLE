import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  TimeScale, // For handling time on the x-axis
  LinearScale, // For y-axis
  PointElement, // For data points
  LineElement, // For drawing lines
  Title, // For chart titles
  Tooltip, // For tooltips
  Legend,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns"; // Required for time scale support

const options = (startDate: Date | undefined, endDate: Date | undefined) => {
  return {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Brewing Status",
      },
    },

    scales: {
      x: {
        type: "time",
        bounds: "ticks",
        min: startDate?.toISOString(),
        max: endDate?.toISOString(),
        time: {
          unit: "hour", // Set the time unit to 'hour'
          tooltipFormat: "d/MMM/yyyy Haaa",
        },
        ticks: {
          source: "auto",
          autoSkip: true,
          maxRotation: 45,
          major: {
            enabled: true,
          },
          color: function (context) {
            return context.tick && context.tick.major
              ? "#fca903"
              : "rgba(252,169,3,0.6)";
          },
          font: function (context) {
            if (context.tick && context.tick.major) {
              return {
                weight: "bold",
              };
            }
          },
        },
        title: {
          display: true,
          text: "Time",
        },
      },

      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Temperature",
        },
        ticks: {
          color: "#fca903",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Gravity",
        },
        ticks: {
          color: "#431ac9",
        },
      },
    },
  };
};

interface Props {
  startDate: Date;
  endDate: Date;
  refresh: number;
}

export const ChartComponent: React.FC<Props> = ({
  startDate,
  endDate,
  refresh,
}) => {
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const start = startDate.toISOString();
      const end = endDate.toISOString();

      const response = await fetch(`/api/getData?start=${start}&end=${end}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        // const labels = data.filter((d) => d.field === "currentTemp")
        //   .map((d) => new Date(d.time));

        const tempData = data
          .filter((d) => d.field === "currentTemp")
          .map((d) => ({
            x: new Date(d.time),
            y: d.value,
          }));

        const gravityData = data
          .filter((d) => d.field === "currentGravity")
          .map((d) => ({
            x: new Date(d.time),
            y: d.value,
          }));

        setChartData({
          // labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: tempData,
              borderColor: "#bae4bc",
              backgroundColor: "#b0e0b0",
              yAxisID: "y",
            },
            {
              label: "Gravity",
              data: gravityData,
              borderColor: "#7bccc4",
              backgroundColor: "#70c0c0",
              yAxisID: "y1",
            },
          ],
        });
      } else {
        console.error("Failed to fetch data");
      }
    }

    fetchData();
  }, [startDate, endDate, refresh]);

  ChartJS.register(
    CategoryScale,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );
  return <Line data={chartData} options={options(startDate, endDate)} />;
};
