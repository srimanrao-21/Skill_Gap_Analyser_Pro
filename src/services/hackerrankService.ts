import { Stats } from '../types/stats';

const BACKEND_URL = "http://localhost:5001/api";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
    } catch (e) {
      if (i === retries - 1) throw e;
    }
    await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
  }
  throw new Error("Failed after retries");
}

export async function fetchHackerRankStats(username: string): Promise<Stats> {
  const cacheKey = `hackerrank_stats_${username.toLowerCase()}`;
  
  // 1. Check Cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS) {
        return data as Stats;
      }
    }
  } catch (e) {
    console.warn("Storage access failed for cache", e);
  }

  try {
    // Use backend API instead of calling HackerRank directly
    const response = await fetchWithRetry(`${BACKEND_URL}/hackerrank/${username}`, {
      method: 'GET'
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const { easy, medium, hard, contestRating, streakDays, weeklyActivity, realName, userAvatar } = data;

    const finalStats: Stats = {
      easy,
      medium,
      hard,
      contestRating,
      streakDays: streakDays || 1,
      weeklyActivity: weeklyActivity || Array(7).fill(0),
      realName,
      userAvatar
    };

    // 3. Save to Cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: finalStats
      }));
    } catch (e) {
      // Ignore storage errors safely
    }

    return finalStats;

  } catch (error) {
    console.error(`Error fetching HackerRank stats for ${username}:`, error);
    throw new Error(`Failed to find HackerRank profile for @${username}`);
  }
}
