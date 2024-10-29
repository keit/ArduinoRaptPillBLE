import React, { useState } from "react";

interface Props {
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
}

export const ThresholdUpdateComponent: React.FC<Props> = (props) => {
  const [newThreshold, setNewThreshold] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  const updateThreshold = async () => {
    if (newThreshold === null) return;
    try {
      const response = await fetch("/updateThreshold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newThreshold }),
      });

      if (response.ok) {
        const result = await response.json();
        setStatus(result.message);
        setIsVisible(true);

        setTimeout(() => {
          props.setRefresh((prev) => prev + 1);
          setNewThreshold(null);
          setIsVisible(false);
        }, 3000);
      } else {
        setStatus("Failed to update threshold");
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error updating threshold");
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center mt-2 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
      <label htmlFor="newThreshold" className="sm:mr-4">
        Update Heater Threshold
      </label>
      <input
        type="number"
        id="newThreshold"
        name="newThreshold"
        value={newThreshold !== null ? newThreshold : ""}
        onChange={(e) => setNewThreshold(parseFloat(e.target.value))}
        className="text-blue-500 placeholder-gray-400 p-2 border border-gray-300 rounded"
        min="0"
        step="0.1"
        required
      />
      <span>°C</span>
      <button
        onClick={updateThreshold}
        className="mt-2 sm:mt-0 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Update
      </button>
      <span
        id="message"
        className={`text-center text-green-500 mt-4 transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {status}
      </span>
    </div>
  );
};
