import { Application } from "@prisma/client";

export const generateChartDataByDate = (applications: Application[]) => {
  if (applications.length === 0) {
    return [];
  }

  // Determine the date range
  const firstApplicationDate = new Date(
    Math.min(
      ...applications.map((app) => new Date(app.appliedAt!).getTime()),
    ),
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

  const startDate = new Date(firstApplicationDate);
  startDate.setHours(0, 0, 0, 0); // Normalize start date to start of day

  const endDate = today;

  // Generate all dates in the range
  const allDates: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    allDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Aggregate application counts by date (YYYY-MM-DD)
  const dateCounts = applications.reduce(
    (accumulator, { appliedAt }) => {
      if (appliedAt) {
        const date = new Date(appliedAt);
        // Normalize to start of local day
        date.setHours(0, 0, 0, 0);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        accumulator[formattedDate] = (accumulator[formattedDate] || 0) + 1;
      }
      return accumulator;
    },
    {} as Record<string, number>,
  );

  // Construct chart data with all dates
  return allDates.map((date) => {
    // Normalize to start of local day
    date.setHours(0, 0, 0, 0);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDateKey = `${year}-${month}-${day}`;

    const displayDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      date: displayDate,
      count: dateCounts[formattedDateKey] || 0,
    };
  });
};
