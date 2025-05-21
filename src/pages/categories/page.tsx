import { useQuery } from '@tanstack/react-query';
import { Edit3, Plus } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/atoms/button';
import { H4 } from '@/components/atoms/typography/h4';
import { useModules } from '@/components/context/ModulesProvider';
import { Query } from '@/components/Query';

export function CategoriesPage() {
  const { alternatives } = useModules();

  const { data, error, isLoading } = useQuery({
    queryKey: ['getAlternativeCategories'],
    queryFn: async () => {
      const categories = await alternatives.repositories.alternativeCategory.findAll();

      return categories;
    },
  });

  return (
    <div className='w-100'>
      <div className='flex items-center justify-between border-b pb-2'>
        <h3 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
          Categories
        </h3>

        <Button type='button' className='self-end' asChild>
          <Link to='/new'>
            <Plus />
          </Link>
        </Button>
      </div>
      <Query isLoading={isLoading} error={error} data={data}>
        {(categories) => (
          <ul className='mt-3'>
            {categories.map((category) => (
              <li key={category.name} className='flex items-center gap-3'>
                <H4 className='text-lg text-neutral-700 uppercase'>{category.name}</H4>
                <Button asChild>
                  <Link to={`/${category.id.toValue()}`}>
                    <Edit3 />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Query>
    </div>
  );
}
