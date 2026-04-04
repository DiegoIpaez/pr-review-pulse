export type KpisData = {
  open: number;
  no_reviews: number;
  approved_pending_merge: number;
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
