import { showOpenFilePicker } from 'file-system-access';
import { type CustomOpenFilePickerOptions } from 'file-system-access/lib/showOpenFilePicker';
import * as React from 'react';

import { cn } from '@/lib/utils';

type OpenFilePickerButtonProps = React.ComponentProps<'button'> & {
  handle?: FileSystemFileHandle;
  options?: CustomOpenFilePickerOptions;
  onFileChange?: (value: FileSystemFileHandle) => void;
};

const OpenFilePickerButton = React.forwardRef<HTMLButtonElement, OpenFilePickerButtonProps>(
  ({ className, onFileChange, options, ...props }, ref) => {
    return (
      <button
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full cursor-pointer items-center space-x-2 rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        onClick={
          onFileChange &&
          (async () => {
            const [fileHandle] = await showOpenFilePicker(options);

            onFileChange(fileHandle!);
          })
        }
        ref={ref}
        {...props}
      >
        <span className='text-foreground border-0 bg-transparent text-sm font-medium'>
          Choose File
        </span>
        <span>{props.handle?.name ?? 'No file chosen'}</span>
      </button>
    );
  },
);
OpenFilePickerButton.displayName = 'OpenFilePickerButton';

export { OpenFilePickerButton };
