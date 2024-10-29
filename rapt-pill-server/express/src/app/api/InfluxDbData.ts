export interface InfluxDbData {
  time: string;
  value: number | boolean | string | null;
  field: string;
}

export interface ReducedData {
  time: Date;
  battery?: number | null;
  currentGravity?: number | null;
  currentTemp?: number | null;
  heaterStatus?: boolean | null;
  heaterThreshold?: number | null;
  memory?: number | null;
}

export const reduceToData = (list: InfluxDbData[]): ReducedData => {
  return list.reduce<ReducedData>(
    (acc, curr) => {
      // Convert the time string to a Date object
      if (!acc.time) {
        acc.time = new Date(curr.time);
      }

      // Map each field to its corresponding value
      switch (curr.field) {
        case "battery":
          acc.battery = typeof curr.value === "number" ? curr.value : null;
          break;
        case "currentGravity":
          acc.currentGravity =
            typeof curr.value === "number" ? curr.value : null;
          break;
        case "currentTemp":
          acc.currentTemp = typeof curr.value === "number" ? curr.value : null;
          break;
        case "heaterStatus":
          acc.heaterStatus =
            typeof curr.value === "boolean" ? curr.value : null;
          break;
        case "heaterThreshold":
          acc.heaterThreshold =
            typeof curr.value === "number" ? curr.value : null;
          break;
        case "memory":
          acc.memory = typeof curr.value === "number" ? curr.value : null;
          break;
        default:
          break;
      }

      return acc;
    },
    { time: new Date() },
  );
};
