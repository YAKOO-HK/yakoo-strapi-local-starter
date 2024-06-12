/**
 * Reference:
 * https://mantine.dev/hooks/use-pagination/
 * https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/hooks/src/use-pagination/use-pagination.ts
 */

function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
}

interface PaginationParams {
  /** Page selected on initial render, defaults to 1 */
  initialPage?: number;

  /** Controlled active page number */
  page?: number;

  /** Total amount of pages */
  total: number;

  /** Siblings amount on left/right side of selected page, defaults to 1 */
  siblings?: number;

  /** Amount of elements visible on left/right edges, defaults to 1  */
  boundaries?: number;
}

interface PaginationState {
  range: (number | 'dots')[];
  active: number;
  first: number;
  last: number;
  next: number;
  previous: number;
}
const DOTS = 'dots' as const;

function getRange(_total: number, siblings: number, boundaries: number, activePage: number): (number | 'dots')[] {
  const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;
  if (totalPageNumbers >= _total) {
    return range(1, _total);
  }

  const leftSiblingIndex = Math.max(activePage - siblings, boundaries);
  const rightSiblingIndex = Math.min(activePage + siblings, _total - boundaries);
  const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
  const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1);
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = siblings * 2 + boundaries + 2;
    return [...range(1, leftItemCount), DOTS, ...range(_total - (boundaries - 1), _total)];
  }
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = boundaries + 1 + 2 * siblings;
    return [...range(1, boundaries), DOTS, ...range(_total - rightItemCount, _total)];
  }
  return [
    ...range(1, boundaries),
    DOTS,
    ...range(leftSiblingIndex, rightSiblingIndex),
    DOTS,
    ...range(_total - boundaries + 1, _total),
  ];
}

export function getPagination({
  total,
  siblings = 1,
  boundaries = 1,
  page,
  initialPage = 1,
}: PaginationParams): PaginationState {
  const _total = Math.max(Math.trunc(total), 0);
  const activePage = page || initialPage;
  const paginationRange = getRange(_total, siblings, boundaries, activePage);
  return {
    range: paginationRange,
    active: activePage,
    first: 1,
    last: _total,
    next: Math.min(activePage + 1, _total),
    previous: Math.max(activePage - 1, 1),
  };
}
