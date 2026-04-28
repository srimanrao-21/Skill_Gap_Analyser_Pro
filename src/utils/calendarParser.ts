export function parseWeeklyActivity(submissionCalendarString: string | undefined): { weeklyActivity: number[], streakDays: number } {
  if (!submissionCalendarString) return { weeklyActivity: [0, 0, 0, 0, 0, 0, 0], streakDays: 0 };

  try {
    const calendar: Record<string, number> = JSON.parse(submissionCalendarString);
    
    // Map timestamp to date string (YYYY-MM-DD)
    const submissionsByDate: Record<string, number> = {};
    Object.entries(calendar).forEach(([ts, count]) => {
      const d = new Date(parseInt(ts, 10) * 1000);
      const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      submissionsByDate[dateString] = (submissionsByDate[dateString] || 0) + count;
    });

    // Compute last 7 days strings
    const last7DaysStrings: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      last7DaysStrings.push(dateString);
    }
    
    // Array of submissions for the last 7 days
    const weeklyActivity = last7DaysStrings.map(dateString => submissionsByDate[dateString] || 0);

    // Calculate streak days (consecutive days backwards)
    let streakDays = 0;
    const checkDate = new Date();
    let dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
    
    if (!submissionsByDate[dateStr]) {
        // If no submission today, checking if streak continued from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
    }

    while (submissionsByDate[dateStr] && submissionsByDate[dateStr] > 0) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
        dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
    }

    return { weeklyActivity, streakDays };
  } catch (error) {
    console.error("Failed to parse calendar", error);
    return { weeklyActivity: [0, 0, 0, 0, 0, 0, 0], streakDays: 0 };
  }
}
