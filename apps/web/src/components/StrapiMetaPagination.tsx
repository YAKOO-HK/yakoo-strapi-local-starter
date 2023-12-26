import { ComponentPropsWithoutRef } from 'react';
import { type StrapiPagination } from '@/strapi/strapi';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

export function StrapiMetaPagination({
  pagination,
  getHref,
  className,
  offset = 3,
}: {
  pagination: StrapiPagination;
  getHref: (page: number) => ComponentPropsWithoutRef<typeof PaginationLink>['href'];
  className?: string;
  offset?: number;
}) {
  if (!pagination.pageCount) {
    return null;
  }
  const lower = Math.max(1, pagination.page - offset);
  const upper = Math.min(pagination.pageCount, pagination.page + offset);
  // console.log('StrapiMetaPagination', pagination);
  // console.log('StrapiMetaPagination', { lower, upper });
  return (
    <Pagination className={className}>
      <PaginationContent>
        {pagination.page > 1 ? <PaginationPrevious href={getHref(pagination.page - 1)} /> : null}
        {lower > 1 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {Array.from({ length: upper - lower + 1 }, (_, i) => i + lower).map((page) => (
          <PaginationLink key={page} isActive={page === pagination.page} href={getHref(page)}>
            {page}
          </PaginationLink>
        ))}
        {upper < pagination.pageCount ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {pagination.page < pagination.pageCount ? <PaginationNext href={getHref(pagination.page + 1)} /> : null}
      </PaginationContent>
    </Pagination>
  );
}
