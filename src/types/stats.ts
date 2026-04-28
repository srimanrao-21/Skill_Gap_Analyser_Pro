export type Stats = {
  easy: number;
  medium: number;
  hard: number;
  contestRating: number;
  streakDays: number;
  weeklyActivity: number[];
  realName?: string;
  userAvatar?: string;
};

export type DifficultyStats = {
  difficulty: "Easy" | "Medium" | "Hard" | "All" | string;
  count: number;
};

export type LeetCodeResponse = {
  data: {
    matchedUser: {
      profile?: {
        realName: string;
        userAvatar: string;
      };
      submitStats: {
        acSubmissionNum: DifficultyStats[];
      };
      userCalendar?: {
        submissionCalendar: string;
      };
    };
    userContestRanking?: {
      rating: number;
    };
  };
};
