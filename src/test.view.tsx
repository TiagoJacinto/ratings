import { useState } from 'react';

type Props = Readonly<{
  weights: number[];
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};
}>;

export function FunctionComponent({ weights }: Props) {
  const [] = useState();

  return (
    <div>
      <button disabled={weights.length === 0}></button>
    </div>
  );
}

const t = {};

// export function hello(){}
