import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
 
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
 
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
 
export const getSkip = (page: number, limit: number): number =>
  (page - 1) * limit;
 
export function toPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
 
export const escapeLike = (value: string): string =>
  value.replace(/[\\%_]/g, '\\$&');
 
export function dateRange(from?: string, to?: string) {
  const start = from ? new Date(from) : undefined;
  const end = to
    ? to.length === 10
      ? new Date(`${to}T23:59:59.999Z`)
      : new Date(to)
    : undefined;
 
  if (start && end) return Between(start, end);
  if (start) return MoreThanOrEqual(start);
  if (end) return LessThanOrEqual(end);
  return undefined;
}