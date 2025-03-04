import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../atoms/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../atoms/card';
import { Checkbox } from '../atoms/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../atoms/form';
import { OpenFilePickerButton } from '../molecules/OpenFilePickerButton';

const formSchema = z.object({
  sqliteDbFileHandle: z.unknown().refine((value) => value instanceof FileSystemFileHandle, {
    message: 'Please choose a SQLite database',
  }),
  permissionToUseFileHandle: z.literal<boolean>(true),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = Readonly<{
  onSubmit: SubmitHandler<FormSchema>;
}>;

export function ChooseSQLiteDatabase({ onSubmit }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissionToUseFileHandle: false,
    },
  });

  const requestPermissionToUseFile = async () => {
    if (!form.getValues().sqliteDbFileHandle || form.getFieldState('sqliteDbFileHandle').invalid)
      return false;

    const permission = await form.getValues().sqliteDbFileHandle.requestPermission();

    return permission === 'granted';
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <Card className='w-[280px]'>
        <CardHeader>
          <CardTitle>Choose a SQLite Database</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='sqliteDbFileHandle'
                render={({ field }) => (
                  <FormItem>
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

              <FormField
                control={form.control}
                name='permissionToUseFileHandle'
                render={({ field }) => (
                  <FormItem className='mt-2 space-x-2'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={async () =>
                          field.onChange(await requestPermissionToUseFile())
                        }
                      />
                    </FormControl>
                    <FormLabel>I allow the use of this SQLite database file</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type='submit'>Continue</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
