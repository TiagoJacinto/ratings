import { TypeORMRatingRepository } from '@/modules/ratings/repositories/rating/implementations/TypeORMRatingRepository';
import { CreateRatingUseCase } from '@/modules/ratings/use-cases/createRating.use-case';
import React, { useContext } from 'react';
import { UpdateRatingUseCase } from '@/modules/ratings/use-cases/updateRating.use-case';
import { GetRatingByIdUseCase } from '@/modules/ratings/use-cases/getRatingById.use-case';
import { type RatingRepository } from '@/modules/ratings/repositories/rating/rating.repository';
import { TypeORMAlternativeCategoryRepository } from '@/modules/alternatives/repositories/alternative-category/implementations/TypeORMAlternativeCategoryRepository';
import { CreateAlternativeCategoryUseCase } from '@/modules/alternatives/use-cases/create-alternative-category.use-case';
import { type AlternativeCategoryRepository } from '@/modules/alternatives/repositories/alternative-category/alternative-category.repository';
import { CreateAlternativeUseCase } from '@/modules/alternatives/use-cases/create-alternative.use-case';
import { TypeORMAlternativeRepository } from '@/modules/alternatives/repositories/alternative/implementations/TypeORMAlternativeRepository';
import { GetAlternativeCategoryByIdUseCase } from '@/modules/alternatives/use-cases/get-alternative-category-by-id.use-case';
import { TypeORMCriterionRepository } from '@/modules/alternatives/repositories/criterion/implementations/TypeORMCriterionRepository';
import { type CriterionRepository } from '@/modules/alternatives/repositories/criterion/criterion.repository';
import { type WeightRepository } from '@/modules/ratings/repositories/weight/weight.repository';
import { TypeORMWeightRepository } from '@/modules/ratings/repositories/weight/implementations/TypeORMWeightRepository';
import { type AlternativeRepository } from '@/modules/alternatives/repositories/alternative/alternative.repository';

import { useDb } from './DbProvider';

type ModulesContext = Readonly<{
  alternatives: {
    repositories: {
      alternative: AlternativeRepository;
      alternativeCategory: AlternativeCategoryRepository;
      criterion: CriterionRepository;
    };
    useCases: {
      createAlternative: CreateAlternativeUseCase;
      createAlternativeCategory: CreateAlternativeCategoryUseCase;
      getAlternativeCategoryById: GetAlternativeCategoryByIdUseCase;
    };
  };
  ratings: {
    repositories: {
      rating: RatingRepository;
      weight: WeightRepository;
    };
    useCases: {
      createRating: CreateRatingUseCase;
      getRatingById: GetRatingByIdUseCase;
      updateRating: UpdateRatingUseCase;
    };
  };
}>;

const ModulesContext = React.createContext({} as ModulesContext);

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function ModulesProvider({ children }: Props) {
  const { orm } = useDb();

  const alternativeRepository = new TypeORMAlternativeRepository(orm);
  const alternativeCategoryRepository = new TypeORMAlternativeCategoryRepository(orm);
  const criterionRepository = new TypeORMCriterionRepository(orm);
  const weightRepository = new TypeORMWeightRepository(orm);
  const ratingRepository = new TypeORMRatingRepository(orm);

  return (
    <ModulesContext.Provider
      value={{
        alternatives: {
          repositories: {
            alternative: alternativeRepository,
            alternativeCategory: alternativeCategoryRepository,
            criterion: criterionRepository,
          },
          useCases: {
            createAlternative: new CreateAlternativeUseCase(
              alternativeCategoryRepository,
              alternativeRepository,
            ),
            createAlternativeCategory: new CreateAlternativeCategoryUseCase(
              alternativeCategoryRepository,
            ),
            getAlternativeCategoryById: new GetAlternativeCategoryByIdUseCase(
              alternativeCategoryRepository,
            ),
          },
        },
        ratings: {
          repositories: {
            rating: ratingRepository,
            weight: weightRepository,
          },
          useCases: {
            createRating: new CreateRatingUseCase(ratingRepository),
            getRatingById: new GetRatingByIdUseCase(ratingRepository),
            updateRating: new UpdateRatingUseCase(ratingRepository),
          },
        },
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
}

export const useModules = () => useContext(ModulesContext);
