type PaginationParams<T> = {
  data: T[];
  page?: number;
  limit?: number;
  totalRecords?: number;
  showAll?: boolean;
};

export type PaginationResponse<T> = {
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

export function paginationFormatter<T>({
  data,
  page,
  limit,
  totalRecords,
  showAll,
}: PaginationParams<T>): PaginationResponse<T> | AllDataResponse<T> {
  if (showAll || !totalRecords || !limit || !page)
    return { data, totalRecords: totalRecords || data?.length };

  const totalPages = Math.ceil(totalRecords / limit);
  const hasNextPage = page < totalPages;

  return {
    data,
    currentPage: page,
    recordsPerPage: limit,
    totalRecords,
    totalPages,
    hasNextPage,
  };
}
