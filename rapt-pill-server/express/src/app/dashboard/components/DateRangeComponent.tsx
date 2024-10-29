import React, { useEffect, useState } from "react";
import { DateRange, Range } from "react-date-range";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
export interface Props {
  setDateRange: React.Dispatch<React.SetStateAction<Range>>;
  dateRange: Range;
}

const DateRangeComponent: React.FC<Props> = (props) => {
  const { setDateRange, dateRange } = props;

  // Need to keep range in this component state because setState of the parent is called
  // from onChange handler, it would be setState inside a render.
  const [range, setRange] = useState<Range>({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: "selection",
  });

  useEffect(() => {
    setDateRange(range);
  }, [setDateRange, range]);

 const [showCalendar, setShowCalendar] = useState(false);

 // Is this worth doing?
 const LucideIcon = dynamic(dynamicIconImports['calendar']);

  return (
    <div className="relative">
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
      >
        <LucideIcon className="w-4 h-4 text-gray-500" />
        <span>Select Date Range</span>
      </div>

      {showCalendar && (
        <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              setRange(item.selection);
            }}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            showDateDisplay={true}
          />
        </div>
      )}
    </div>
  );
}

export default DateRangeComponent;
