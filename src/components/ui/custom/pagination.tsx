import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import Button from './button';

type PaginationProps = {
  data: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasNextPage: boolean;
  };
  onPageChange: (page: number) => void;
};

export default function Pagination({ data, onPageChange }: PaginationProps) {
  if (!data || !data.totalPages) return null;
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {data?.currentPage} of {data?.totalPages} ({data?.totalRecords}{' '}
        total records)
      </p>
      {data?.totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={data?.currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(data?.currentPage - 1)}
            disabled={data?.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(data?.currentPage + 1)}
            disabled={!data?.hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(data?.totalPages)}
            disabled={!data?.hasNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
