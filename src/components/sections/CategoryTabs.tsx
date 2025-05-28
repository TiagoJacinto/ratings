import { type UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { Textarea } from '@/components/atoms/textarea';
import { CriteriaForm } from '@/components/forms/criteria-form.view';
import { RatingsForm } from '@/components/forms/ratings-form.view';
import { AlternativesForm } from '@/components/forms/alternatives-form.view';
import { type FormSchema } from '@/view/form.schema';

type Props = Readonly<{
  form: UseFormReturn<FormSchema>;
  value?: string;
  onValueChange?: (value: string) => void;
}>;

export function CategoryTabs({ form, onValueChange, value }: Props) {
  return (
    <Tabs defaultValue='details' value={value} onValueChange={onValueChange}>
      <TabsList className='w-full'>
        <TabsTrigger value='details'>Details</TabsTrigger>
        <TabsTrigger value='criteria'>Criteria</TabsTrigger>
        <TabsTrigger value='ratings'>Ratings</TabsTrigger>
        <TabsTrigger value='alternatives'>Alternatives</TabsTrigger>
      </TabsList>

      <TabsContent value='details' className='my-2 flex flex-col gap-y-3 px-1'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className='h-32' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value='criteria'>
        <CriteriaForm form={form} />
      </TabsContent>

      <TabsContent value='ratings'>
        <RatingsForm form={form} />
      </TabsContent>

      <TabsContent value='alternatives'>
        <AlternativesForm form={form} />
      </TabsContent>
    </Tabs>
  );
}
