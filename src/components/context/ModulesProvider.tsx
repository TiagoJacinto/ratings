import { TypeORMRatingRepository } from '@/modules/ratings/repositories/rating/implementations/TypeORMRatingRepository';
import { CreateRatingUseCase } from '@/modules/ratings/use-cases/createRating.use-case';
import React, { useContext } from 'react';
import { UpdateRatingUseCase } from '@/modules/ratings/use-cases/updateRating.use-case';
import { GetRatingByIdUseCase } from '@/modules/ratings/use-cases/getRatingById.use-case';
import { type RatingRepository } from '@/modules/ratings/repositories/rating/rating.repository';
import { TypeORMWeightRepository } from '@/modules/ratings/repositories/weight/implementations/TypeORMWeightRepository';
import { type WeightRepository } from '@/modules/ratings/repositories/weight/weight.repository';

import { useDb } from './DbProvider';

type ModulesContext = Readonly<{
  ratings: {
    repositories: {
      rating: RatingRepository;
    };
    useCases: {
      createRating: CreateRatingUseCase;
      getRatingById: GetRatingByIdUseCase;
      updateRating: UpdateRatingUseCase;
    };
  };
  weights: {
    repositories: {
      weight: WeightRepository;
    };
  };
}>;

const ModulesContext = React.createContext({} as ModulesContext);

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function ModulesProvider({ children }: Props) {
  const { orm } = useDb();

  const weightRepository = new TypeORMWeightRepository(orm);
  const ratingRepository = new TypeORMRatingRepository(orm, weightRepository);

  return (
    <ModulesContext.Provider
      value={{
        ratings: {
          repositories: {
            rating: ratingRepository,
          },
          useCases: {
            createRating: new CreateRatingUseCase(ratingRepository),
            getRatingById: new GetRatingByIdUseCase(ratingRepository),
            updateRating: new UpdateRatingUseCase(ratingRepository),
          },
        },
        weights: {
          repositories: {
            weight: weightRepository,
          },
        },
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
}

export const useModules = () => useContext(ModulesContext);
