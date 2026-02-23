export type PaginatedResponse<T> = {
  data: T[];
  currentPage: number;
  recordsPerPage: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
};

export type AllDataResponse<T> = {
  data: T[];
  totalRecords: number;
};

export type GetResponse<T> = PaginatedResponse<T> | AllDataResponse<T>;

export type ListQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  showAll?: boolean;
};
