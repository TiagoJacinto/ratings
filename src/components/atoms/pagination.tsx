import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/atoms/button';
import { Link } from 'react-router';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = Pick<React.ComponentProps<typeof Button>, 'size'> & {
  isActive?: boolean;
};

type PaginationNativeLinkProps = React.ComponentProps<'a'> & PaginationLinkProps;

function PaginationNativeLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationNativeLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(
        buttonVariants({
          size,
          variant: isActive ? 'outline' : 'ghost',
        }),
        className,
      )}
      {...props}
    />
  );
}

type PaginationReactRouterLinkProps = React.ComponentProps<typeof Link> & PaginationLinkProps;

function PaginationReactRouterLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationReactRouterLinkProps) {
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(
        buttonVariants({
          size,
          variant: isActive ? 'outline' : 'ghost',
        }),
        className,
      )}
      {...props}
    />
  );
}

type PaginationButtonLinkProps = React.ComponentProps<typeof Button> & PaginationLinkProps;

function PaginationButtonLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationButtonLinkProps) {
  return (
    <Button
      type='button'
      variant='ghost'
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(buttonVariants({ size, variant: isActive ? 'outline' : 'ghost' }), className)}
      {...props}
    />
  );
}

function PaginationNativePrevious({ className, ...props }: PaginationNativeLinkProps) {
  return (
    <PaginationNativeLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className='hidden sm:block'>Previous</span>
    </PaginationNativeLink>
  );
}

function PaginationReactRouterPrevious({ className, ...props }: PaginationReactRouterLinkProps) {
  return (
    <PaginationReactRouterLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className='hidden sm:block'>Previous</span>
    </PaginationReactRouterLink>
  );
}

function PaginationButtonPrevious({ className, ...props }: PaginationButtonLinkProps) {
  return (
    <PaginationButtonLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className='hidden sm:block'>Previous</span>
    </PaginationButtonLink>
  );
}

function PaginationNativeNext({ className, ...props }: PaginationNativeLinkProps) {
  return (
    <PaginationNativeLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className='hidden sm:block'>Next</span>
      <ChevronRightIcon />
    </PaginationNativeLink>
  );
}

function PaginationReactRouterNext({ className, ...props }: PaginationReactRouterLinkProps) {
  return (
    <PaginationReactRouterLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className='hidden sm:block'>Next</span>
      <ChevronRightIcon />
    </PaginationReactRouterLink>
  );
}

function PaginationButtonNext({ className, ...props }: PaginationButtonLinkProps) {
  return (
    <PaginationButtonLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className='hidden sm:block'>Next</span>
      <ChevronRightIcon />
    </PaginationButtonLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className='size-4' />
      <span className='sr-only'>More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationNativeLink,
  PaginationReactRouterLink,
  PaginationButtonLink,
  PaginationItem,
  PaginationNativePrevious,
  PaginationReactRouterPrevious,
  PaginationButtonPrevious,
  PaginationNativeNext,
  PaginationReactRouterNext,
  PaginationButtonNext,
  PaginationEllipsis,
};
