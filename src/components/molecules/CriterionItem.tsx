import { Trash2 } from 'lucide-react';

import { Button } from '../atoms/button';
import { CriterionName } from './CriterionName';

type Props = Readonly<{
  name?: string;
  components: {
    Slider: React.JSX.Element;
  };
  value: string | number;
  onDelete: () => void;
}>;

export function CriterionItem({ name, components, onDelete, value }: Props) {
  return (
    <li className='flex items-center justify-between gap-2 rounded-lg border p-2 max-sm:flex-col sm:items-center'>
      <CriterionName>{name}</CriterionName>

      <div className='flex items-center space-x-3'>
        <span>{value}</span>

        {components.Slider}

        <Button type='button' variant='destructive' onClick={onDelete}>
          <Trash2 />
        </Button>
      </div>
    </li>
  );
}
