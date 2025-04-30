import { TypeORMRatingRepository } from '@/modules/ratings/repositories/rating/implementations/TypeORMRatingRepository';
import { CreateRatingUseCase } from '@/modules/ratings/use-cases/createRating.use-case';
import React, { useContext } from 'react';
import { TypeORMWeightRepository } from '@/modules/weights/repositories/weight/implementations/TypeORMWeightRepository';
import { UpdateRatingUseCase } from '@/modules/ratings/use-cases/updateRating.use-case';
import { GetRatingByIdUseCase } from '@/modules/ratings/use-cases/getRatingById.use-case';

import { useDb } from './DbProvider';

type UseCasesContext = Readonly<{
  createRatingUseCase: CreateRatingUseCase;
  getRatingByIdUseCase: GetRatingByIdUseCase;
  updateRatingUseCase: UpdateRatingUseCase;
}>;

const UseCasesContext = React.createContext({} as UseCasesContext);

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function UseCasesProvider({ children }: Props) {
  const { orm } = useDb();

  const weightRepository = new TypeORMWeightRepository(orm);
  const ratingRepository = new TypeORMRatingRepository(orm, weightRepository);

  return (
    <UseCasesContext.Provider
      value={{
        createRatingUseCase: new CreateRatingUseCase(ratingRepository),
        getRatingByIdUseCase: new GetRatingByIdUseCase(ratingRepository),
        updateRatingUseCase: new UpdateRatingUseCase(ratingRepository),
      }}
    >
      {children}
    </UseCasesContext.Provider>
  );
}

export const useUseCases = () => useContext(UseCasesContext);
