import { useQuery } from '@tanstack/react-query';
import { Edit3 } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/atoms/button';
import { H2 } from '@/components/atoms/typography/h2';
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
    <>
      <H2>Categories</H2>
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
    </>
  );
}
