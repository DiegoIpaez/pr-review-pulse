export type KpisData = {
  open: number;
  no_reviews: number;
  approved_pending_merge: number;
  merged: number;
};

export type TimeSeriesData = {
  date: string;
  created: number;
  closed: number;
  merged: number;
};

export type DistributionItem = {
  type: string;
  count: number;
  percentage: number;
};

export type RankingAuthor = {
  uid: number;
  username: string;
  avatar_url: string | null;
  count: number;
};

export type RankingDimensionItem = {
  key: string; // valor de PullRequestType o PullRequestState
  count: number; // total de PRs en esa dimensión
  topAuthor: RankingAuthor | null;
  ranking: RankingAuthor[];
};

export type PullRequestRanking = {
  byType: RankingDimensionItem[];
  byState: RankingDimensionItem[];
};
