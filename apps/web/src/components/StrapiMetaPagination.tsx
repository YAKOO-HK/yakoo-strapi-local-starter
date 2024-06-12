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
        {range.map((page, i) => {
          if (page === 'dots') {
            return (
              <PaginationItem key={`dots-${i}`}>
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
      </PaginationContent>
    </Pagination>
  );
}
