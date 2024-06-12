import { type ComponentPropsWithoutRef } from 'react';
import { getPagination } from '@/lib/pagination';
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
  const { range, active, previous, next } = getPagination({
    page: pagination.page,
    total: pagination.pageCount,
    siblings: offset,
    boundaries: 1,
  });
  // console.log(pagination, range);
  return (
    <Pagination className={className}>
      <PaginationContent>
        {active !== previous ? <PaginationPrevious href={getHref(previous)} /> : null}
        {range.map((page) => {
          if (page === 'dots') {
            return (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationLink key={page} isActive={page === active} href={getHref(page)}>
              {page}
            </PaginationLink>
          );
        })}
        {active !== next ? <PaginationNext href={getHref(next)} /> : null}
        {/* {pagination.page > 1 ? <PaginationPrevious href={getHref(pagination.page - 1)} /> : null}
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
        {pagination.page < pagination.pageCount ? <PaginationNext href={getHref(pagination.page + 1)} /> : null} */}
      </PaginationContent>
    </Pagination>
  );
}
