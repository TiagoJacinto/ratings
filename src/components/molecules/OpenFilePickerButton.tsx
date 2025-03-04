import { cn } from '@/lib/utils';
import { showOpenFilePicker } from 'file-system-access';
import { type CustomOpenFilePickerOptions } from 'file-system-access/lib/showOpenFilePicker';
import * as React from 'react';

type OpenFilePickerButtonProps = React.ComponentProps<"button"> & {
  handle?: FileSystemFileHandle;
  onFileChange?: (value: FileSystemFileHandle) => void;
  options?: CustomOpenFilePickerOptions;
};

const OpenFilePickerButton = React.forwardRef<HTMLButtonElement, OpenFilePickerButtonProps>(
  ({ className, options, onFileChange, ...props }, ref) => {
    return (
      <button
        className={cn(
          'flex h-10 space-x-2 cursor-pointer w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
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
        <span className='border-0 bg-transparent text-sm font-medium text-foreground'>
          Choose File
        </span>
        <span>{props.handle?.name ?? 'No file chosen'}</span>
      </button>
    );
  }
);
OpenFilePickerButton.displayName = 'OpenFilePickerButton';

export { OpenFilePickerButton };
