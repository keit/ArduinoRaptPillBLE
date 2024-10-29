"use client"; // Add this at the top

import React, { ComponentType, useEffect, useState } from "react";
import { subDays } from "date-fns";
import "react-date-range/dist/styles.css"; // Main css file
import "react-date-range/dist/theme/default.css"; // Theme css file
import { ChartComponent } from "./components/ChartComponent";
import { Range } from "react-date-range";
import { Props as DateRangeComponentProps } from "./components/DateRangeComponent";
import dynamic from "next/dynamic";
import { assertIsDefined } from "./util";
import { CurrentStatusComponent } from "./components/CurrentStatusComponent";
import { ThresholdUpdateComponent } from "./components/ThresholdUpdateComponent";

// Define the type for the dynamic import
type ComponentImport = Promise<{
  default: ComponentType<DateRangeComponentProps>;
}>;

const DynamicDateRangeComponent = dynamic<DateRangeComponentProps>(
  () => import("./components/DateRangeComponent") as ComponentImport,
  {
    ssr: false, // This ensures the component is rendered only on the client
  },
);
const DateRangeComponent: ComponentType<DateRangeComponentProps> =
  DynamicDateRangeComponent;

export default function Home() {
  const [dateRange, setDateRange] = useState<Range>({
    startDate: subDays(new Date(), 1),
    endDate: new Date(),
  });

  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    // Set up the interval
    const intervalId = setInterval(() => {
      setRefresh((prev) => prev + 1);
    }, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this only runs on mount/unmount

  const startDate = dateRange.startDate;
  const endDate = dateRange.endDate;
  assertIsDefined(startDate);
  assertIsDefined(endDate);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "400px",
        }}
      >
        <div>
          <DateRangeComponent
            setDateRange={setDateRange}
            dateRange={dateRange}
          />
        </div>
      </div>
      <ChartComponent
        startDate={startDate}
        endDate={endDate}
        refresh={refresh}
      />
      <CurrentStatusComponent refresh={refresh} />
      <ThresholdUpdateComponent setRefresh={setRefresh} />
    </div>
  );
}
