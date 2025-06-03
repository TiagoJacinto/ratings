'use client';

import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Database,
  Clock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Merge,
  Upload,
  Download,
} from 'lucide-react';
import { Link } from 'react-router';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/atoms/alert';
import { cn } from '@/lib/utils';
import { type StorageType } from '@/types';
import { OpenFilePickerButton } from '@/components/molecules/OpenFilePickerButton';
import { RadioCard, RadioCardItem } from '@/components/atoms/radio-card';

const migrationStrategy = z.enum(['use-target', 'merge', 'overwrite']);

type MigrationStrategy = z.infer<typeof migrationStrategy>;

const formSchema = z.discriminatedUnion('newStorageType', [
  z.object({
    migrationStrategy,
    newStorageType: z.literal('decide-later'),
  }),
  z.object({
    migrationStrategy,
    newStorageType: z.literal('sqlite'),
    sqliteDbFileHandle: z.unknown().refine((value) => value instanceof FileSystemFileHandle, {
      message: 'Please choose a SQLite database',
    }),
  }),
]);

type FormValues = z.infer<typeof formSchema>;

type Props = Readonly<{
  currentStorageType?: StorageType;
  isSubmitting: boolean;
  handleSubmit: (data: FormValues) => void;
}>;

export function StoragePreferencesForm({ currentStorageType, handleSubmit, isSubmitting }: Props) {
  const [showChangeForm, setShowChangeForm] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      migrationStrategy: 'merge',
    },
    resolver: zodResolver(formSchema),
  });

  const newStorageType = form.watch('newStorageType');
  const migrationStrategy = form.watch('migrationStrategy');

  const handleStartChange = () => {
    setShowChangeForm(true);
  };

  const handleCancelChange = () => {
    setShowChangeForm(false);
    form.reset();
  };

  const getStorageDisplayInfo = (storageType: StorageType) => ({
    "decide-later": {
      name: 'Temporary Storage',
      color: 'orange',
      description: 'Data stored temporarily in browser memory',
      details: 'Data will be lost when cache is cleared',
      icon: Clock,
    },
    "sqlite": {
      name: 'SQLite Database',
      color: 'green',
      description: 'Persistent local database storage',
      details: 'SQLite Database',
      icon: Database,
    }
  })[storageType];

  if (!currentStorageType) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-8'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
            <p className='text-muted-foreground'>Loading storage configuration...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStorageInfo = getStorageDisplayInfo(currentStorageType);
  const CurrentStorageIcon = currentStorageInfo.icon;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleSubmit(data);
    setShowChangeForm(false);
    form.reset();
  };

  const isToSQLite = newStorageType === 'sqlite';
  const fromName = currentStorageType === 'sqlite' ? 'SQLite database' : 'temporary storage';
  const toName = isToSQLite ? 'SQLite database' : 'temporary storage';

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link to='/'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Back to Categories
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CurrentStorageIcon className='h-5 w-5' />
            Current Storage Configuration
          </CardTitle>
          <CardDescription>Your current data storage settings</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div
            className={cn(
              'rounded-lg border-2 p-4',
              currentStorageInfo.color === 'green' && 'border-green-200 bg-green-50',
              currentStorageInfo.color === 'orange' && 'border-orange-200 bg-orange-50',
              currentStorageInfo.color === 'gray' && 'border-gray-200 bg-gray-50',
            )}
          >
            <div className='flex items-start gap-3'>
              <div
                className={cn(
                  'rounded-lg p-2',
                  currentStorageInfo.color === 'green' && 'bg-green-100',
                  currentStorageInfo.color === 'orange' && 'bg-orange-100',
                  currentStorageInfo.color === 'gray' && 'bg-gray-100',
                )}
              >
                <CurrentStorageIcon
                  className={cn(
                    'h-6 w-6',
                    currentStorageInfo.color === 'green' && 'text-green-600',
                    currentStorageInfo.color === 'orange' && 'text-orange-600',
                    currentStorageInfo.color === 'gray' && 'text-gray-600',
                  )}
                />
              </div>
              <div className='flex-1'>
                <h3
                  className={cn(
                    'font-semibold',
                    currentStorageInfo.color === 'green' && 'text-green-900',
                    currentStorageInfo.color === 'orange' && 'text-orange-900',
                    currentStorageInfo.color === 'gray' && 'text-gray-900',
                  )}
                >
                  {currentStorageInfo.name}
                </h3>
                <p
                  className={cn(
                    'mt-1 text-sm',
                    currentStorageInfo.color === 'green' && 'text-green-800',
                    currentStorageInfo.color === 'orange' && 'text-orange-800',
                    currentStorageInfo.color === 'gray' && 'text-gray-800',
                  )}
                >
                  {currentStorageInfo.description}
                </p>
                <p
                  className={cn(
                    'mt-2 text-xs',
                    currentStorageInfo.color === 'green' && 'text-green-700',
                    currentStorageInfo.color === 'orange' && 'text-orange-700',
                    currentStorageInfo.color === 'gray' && 'text-gray-700',
                  )}
                >
                  {currentStorageInfo.details}
                </p>
                {/* <p
                  className={cn(
                    'mt-1 text-xs',
                    currentStorageInfo.color === 'green' && 'text-green-600',
                    currentStorageInfo.color === 'orange' && 'text-orange-600',
                    currentStorageInfo.color === 'gray' && 'text-gray-600',
                  )}
                >
                  Configured: {new Date(currentStorageType.configuredAt).toLocaleString()}
                </p> */}
              </div>
            </div>
          </div>

          {!showChangeForm && (
            <div className='flex justify-end'>
              <Button onClick={handleStartChange} className='flex items-center gap-2'>
                <Database className='h-4 w-4' />
                Change Storage Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showChangeForm && (
        <Card>
          <CardHeader>
            <CardTitle>Change Storage Configuration</CardTitle>
            <CardDescription>
              Select a new storage type and configure the migration options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='newStorageType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base font-medium'>New Storage Type</FormLabel>

                      <FormControl>
                        <RadioCard
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='grid gap-4 md:grid-cols-2'
                        >
                          <FormItem>
                            <FormControl>
                              <StorageRadioCardItem
                                cons={[
                                  'Data lost on browser close',
                                  'No backup capability',
                                  'Limited storage space',
                                ]}
                                description='Use browser memory for temporary storage'
                                components={{
                                  Icon: <Clock className='h-5 w-5 text-orange-600' />,
                                }}
                                pros={[
                                  'Quick setup',
                                  'No configuration required',
                                  'Immediate access',
                                ]}
                                title='Temporary Storage'
                                value='decide-later'
                                currentStorageType={currentStorageType}
                              />
                            </FormControl>
                          </FormItem>

                          <FormItem>
                            <FormControl>
                              <StorageRadioCardItem
                                cons={[
                                  'Requires configuration',
                                  'Database file management',
                                  'Slightly slower initial setup',
                                ]}
                                description='Use local SQLite database for persistent storage'
                                components={{
                                  Icon: <Database className='h-5 w-5 text-blue-600' />,
                                }}
                                pros={[
                                  'Persistent storage',
                                  'Data backup support',
                                  'Better performance',
                                  'Larger storage capacity',
                                ]}
                                title='SQLite Database'
                                value='sqlite'
                                currentStorageType={currentStorageType}
                              />
                            </FormControl>
                          </FormItem>
                        </RadioCard>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  <h3 className='flex items-center gap-2 font-medium text-gray-900'>
                    <Merge className='h-5 w-5' />
                    Data Migration Strategy
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Choose how to handle your existing data when switching storage types.
                  </p>

                  <FormField
                    control={form.control}
                    name='migrationStrategy'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioCard
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='grid gap-4 md:grid-cols-2'
                          >
                            <FormItem>
                              <FormControl>
                                <MigrationStrategyRadioCardItem
                                  color='blue'
                                  value='merge'
                                  title='Merge Data'
                                  components={{
                                    Icon: <Merge className='h-4 w-4 text-blue-600' />,
                                  }}
                                  description={`Combine data from both ${fromName} and ${toName}`}
                                  details='Existing data in both sources will be preserved and combined. Conflicts will be resolved automatically.'
                                />
                              </FormControl>
                            </FormItem>

                            <FormItem>
                              <FormControl>
                                <MigrationStrategyRadioCardItem
                                  value='overwrite'
                                  color='green'
                                  description={`Replace ${toName} data with current ${fromName} data`}
                                  details={`All data from your current ${fromName} will be transferred, replacing any existing data in the ${toName}.`}
                                  components={{
                                    Icon: <Upload className='h-4 w-4 text-green-600' />,
                                  }}
                                  title='Overwrite with Current Data'
                                />
                              </FormControl>
                            </FormItem>

                            <FormItem>
                              <FormControl>
                                <MigrationStrategyRadioCardItem
                                  value='use-target'
                                  color='purple'
                                  description={`Keep existing ${toName} data, discard current data`}
                                  details={`Your current ${fromName} data will be discarded and you'll use the existing data from the ${toName}.`}
                                  components={{
                                    Icon: <Download className='h-4 w-4 text-purple-600' />,
                                  }}
                                  title={`Use ${isToSQLite ? 'Database' : 'Temporary'} Data`}
                                />
                              </FormControl>
                            </FormItem>
                          </RadioCard>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {migrationStrategy && (
                    <Alert
                      className={cn(
                        'rounded-lg border-2',
                        migrationStrategy === 'merge' && 'border-blue-200 bg-blue-50',
                        migrationStrategy === 'overwrite' && 'border-yellow-200 bg-yellow-50',
                        migrationStrategy === 'use-target' && 'border-purple-200 bg-purple-50',
                      )}
                    >
                      <AlertTriangle
                        className={cn(
                          'h-4 w-4',
                          migrationStrategy === 'merge' && 'text-blue-600',
                          migrationStrategy === 'overwrite' && 'text-yellow-600',
                          migrationStrategy === 'use-target' && 'text-purple-600',
                        )}
                      />
                      <AlertTitle
                        className={cn(
                          migrationStrategy === 'merge' && 'text-blue-900',
                          migrationStrategy === 'overwrite' && 'text-yellow-900',
                          migrationStrategy === 'use-target' && 'text-purple-900',
                        )}
                      >
                        {migrationStrategy === 'merge' && 'Data Merge'}
                        {migrationStrategy === 'overwrite' && 'Data Overwrite'}
                        {migrationStrategy === 'use-target' && 'Use Target Data'}
                      </AlertTitle>
                      <AlertDescription
                        className={cn(
                          'text-xs',
                          migrationStrategy === 'merge' && 'text-blue-800',
                          migrationStrategy === 'overwrite' && 'text-yellow-800',
                          migrationStrategy === 'use-target' && 'text-purple-800',
                        )}
                      >
                        {migrationStrategy === 'merge' &&
                          'Your data from both sources will be combined. Categories with the same name will be merged intelligently.'}
                        {migrationStrategy === 'overwrite' &&
                          'All existing data in the target storage will be replaced with your current data. This action cannot be undone.'}
                        {migrationStrategy === 'use-target' &&
                          'Your current data will be discarded and replaced with the existing data from the target storage.'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {newStorageType === 'sqlite' && (
                  <div className='space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                    <h3 className='flex items-center gap-2 font-medium text-blue-900'>
                      <Database className='h-5 w-5' />
                      SQLite Database Configuration
                    </h3>

                    <FormField
                      control={form.control}
                      name='sqliteDbFileHandle'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SQLite Database File</FormLabel>
                          <FormControl>
                            <OpenFilePickerButton
                              type='button'
                              handle={field.value}
                              onFileChange={field.onChange}
                              options={{
                                types: [
                                  {
                                    accept: {
                                      'application/vnd.sqlite3': ['.db', '.sqlite3'],
                                    },
                                  },
                                ],
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className='flex flex-col gap-3 pt-4 sm:flex-row'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCancelChange}
                    className='w-full sm:w-auto'
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting} className='w-full flex-1 sm:w-auto'>
                    {isSubmitting ? (
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                        {newStorageType === 'sqlite' ? 'Migrating Data...' : 'Changing Storage...'}
                      </div>
                    ) : (
                      'Apply Changes'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type StorageRadioCardItemProps = Readonly<{
  components: {
    Icon: React.JSX.Element;
  };
  cons: string[];
  currentStorageType: StorageType;
  description: string;
  pros: string[];
  title: string;
  value: StorageType;
}>;

function StorageRadioCardItem({
  components,
  cons,
  currentStorageType,
  description,
  pros,
  title,
  value,
}: StorageRadioCardItemProps) {
  const isCurrentStorageType = currentStorageType === value;

  return (
    <RadioCardItem disabled={isCurrentStorageType} value={value} className='mb-3 flex-col'>
      <div className='mb-3 flex items-center gap-3'>
        <div className='rounded-lg bg-blue-100 p-2'>{components.Icon}</div>
        <div>
          <h3 className='font-semibold text-gray-900'>
            {title}
            {isCurrentStorageType && <span className='ml-2 text-sm text-gray-500'>(Current)</span>}
          </h3>
        </div>
      </div>
      <p className='mb-3 text-sm text-gray-600'>{description}</p>
      <div className='grid gap-3 text-xs md:grid-cols-2'>
        <div>
          <h4 className='mb-1 font-medium text-green-700'>Pros:</h4>
          <ul className='space-y-1'>
            {pros.map((pro, index) => (
              <li key={index} className='flex items-center gap-1 text-green-600'>
                <CheckCircle className='h-3 w-3 shrink-0' />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className='mb-1 font-medium text-red-700'>Cons:</h4>
          <ul className='space-y-1'>
            {cons.map((con, index) => (
              <li key={index} className='flex items-center gap-1 text-red-600'>
                <AlertTriangle className='h-3 w-3 shrink-0' />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RadioCardItem>
  );
}

type MigrationStrategyRadioCardItemProps = Readonly<{
  color: string;
  components: {
    Icon: React.JSX.Element;
  };
  description: string;
  details: string;
  title: string;
  value: MigrationStrategy;
}>;

function MigrationStrategyRadioCardItem({
  color,
  components,
  description,
  details,
  title,
  value,
}: MigrationStrategyRadioCardItemProps) {
  return (
    <RadioCardItem
      value={value}
      className='rounded-lg p-3 ring-2 ring-gray-200 transition-all duration-200 hover:ring-blue-300 data-[state=checked]:bg-blue-50 data-[state=checked]:ring-blue-500'
    >
      <div className='mb-2 flex items-center gap-2'>
        <div
          className={cn(
            'rounded-lg p-1.5',
            color === 'blue' && 'bg-blue-100',
            color === 'green' && 'bg-green-100',
            color === 'purple' && 'bg-purple-100',
          )}
        >
          {components.Icon}
        </div>
        <h4 className='text-sm font-medium text-gray-900'>{title}</h4>
      </div>
      <p className='mb-2 text-xs text-gray-600'>{description}</p>
      <p className='text-xs leading-relaxed text-gray-500'>{details}</p>
    </RadioCardItem>
  );
}
