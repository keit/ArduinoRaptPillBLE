import { ReducedData } from "@/app/api/InfluxDbData";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";

interface Props {
  refresh: number;
}

export const CurrentStatusComponent: React.FC<Props> = (props) => {
  const [currentStatus, setCurrentStatus] = useState<ReducedData>(
    {} as ReducedData,
  );

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/getLatest", {
        method: "GET",
      });

      if (response.ok) {
        const data: ReducedData = await response.json();
        setCurrentStatus(data);
      } else {
        console.error("Failed to fetch data");
      }
    }

    fetchData();
  }, [props.refresh]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Current Status</h3>
      <div className="flex flex-wrap gap-6">
        {currentStatus.time && (
          <div className="flex flex-col items-center">
            <span className="font-bold">Time:</span>
            <span>{format(new Date(currentStatus.time), "d MMM p")}</span>
          </div>
        )}
        {currentStatus.currentGravity !== undefined && (
          <div className="flex flex-col items-center">
            <span className="font-bold">Current Gravity:</span>
            <span>{currentStatus.currentGravity?.toFixed(3)}</span>
          </div>
        )}
        {currentStatus.currentTemp !== undefined && (
          <div className="flex flex-col items-center">
            <span className="font-bold">Current Temperature:</span>
            <span>{currentStatus.currentTemp?.toFixed(1)}°C</span>
          </div>
        )}
        {currentStatus.heaterStatus !== undefined && (
          <div className="flex flex-col items-center">
            <span className="font-bold">Heater Status:</span>
            <span>{currentStatus.heaterStatus ? "On" : "Off"}</span>
          </div>
        )}
        {currentStatus.heaterThreshold !== undefined && (
          <div className="flex flex-col items-center">
            <span className="font-bold">Heater Threshold:</span>
            <span>{currentStatus.heaterThreshold}°C</span>
          </div>
        )}
        {currentStatus.battery !== undefined && (
          <div className="flex flex-col items-center">
            <span className="font-bold">Battery:</span>
            <span>{currentStatus.battery}%</span>
          </div>
        )}
        {currentStatus.memory !== undefined && (
          <div className="flex flex-col items-center">
            <span className="font-bold">Memory:</span>
            <span>{currentStatus.memory}Bytes</span>
          </div>
        )}
      </div>
    </div>
  );
};
