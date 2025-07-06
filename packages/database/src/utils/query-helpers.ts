export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function createPagination<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginationResult<T> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 10));
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
