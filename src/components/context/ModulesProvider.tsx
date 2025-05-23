import React, { useContext } from 'react';

import { TypeORMRatingRepository } from '@/modules/ratings/repositories/rating/implementations/TypeORMRatingRepository';
import { type RatingRepository } from '@/modules/ratings/repositories/rating/rating.repository';
import { TypeORMAlternativeCategoryRepository } from '@/modules/alternatives/repositories/alternative-category/implementations/TypeORMAlternativeCategoryRepository';
import { CreateAlternativeCategoryUseCase } from '@/modules/alternatives/use-cases/create-alternative-category.use-case';
import { type AlternativeCategoryRepository } from '@/modules/alternatives/repositories/alternative-category/alternative-category.repository';
import { TypeORMAlternativeRepository } from '@/modules/alternatives/repositories/alternative/implementations/TypeORMAlternativeRepository';
import { GetAlternativeCategoryByIdUseCase } from '@/modules/alternatives/use-cases/get-alternative-category-by-id.use-case';
import { TypeORMCriterionRepository } from '@/modules/alternatives/repositories/criterion/implementations/TypeORMCriterionRepository';
import { type CriterionRepository } from '@/modules/alternatives/repositories/criterion/criterion.repository';
import { type WeightRepository } from '@/modules/ratings/repositories/weight/weight.repository';
import { TypeORMWeightRepository } from '@/modules/ratings/repositories/weight/implementations/TypeORMWeightRepository';
import { type AlternativeRepository } from '@/modules/alternatives/repositories/alternative/alternative.repository';
import { type RatedCriterionRepository } from '@/modules/alternatives/repositories/rated-criterion/rated-criterion.repository';
import { TypeORMRatedCriterionRepository } from '@/modules/alternatives/repositories/rated-criterion/implementations/TypeORMRatedCriterionRepository';
import { UpdateAlternativeCategoryUseCase } from '@/modules/alternatives/use-cases/update-alternative-category.use-case';
import { ImportAlternativeCategoryUseCase } from '@/modules/alternatives/use-cases/import-alternative-category.use-case';
import { DeleteAlternativeCategoryByIdUseCase } from '@/modules/alternatives/use-cases/delete-alternative-category.use-case';

import { useDb } from './DbProvider';

type ModulesContext = Readonly<{
  alternatives: {
    repositories: {
      alternative: AlternativeRepository;
      alternativeCategory: AlternativeCategoryRepository;
      criterion: CriterionRepository;
      ratedCriterion: RatedCriterionRepository;
    };
    useCases: {
      createAlternativeCategory: CreateAlternativeCategoryUseCase;
      deleteAlternativeCategory: DeleteAlternativeCategoryByIdUseCase;
      getAlternativeCategoryById: GetAlternativeCategoryByIdUseCase;
      importAlternativeCategory: ImportAlternativeCategoryUseCase;
      updateAlternativeCategory: UpdateAlternativeCategoryUseCase;
    };
  };
  ratings: {
    repositories: {
      rating: RatingRepository;
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

  const alternativeRepository = new TypeORMAlternativeRepository(orm),
    alternativeCategoryRepository = new TypeORMAlternativeCategoryRepository(orm),
    criterionRepository = new TypeORMCriterionRepository(orm),
    ratedCriterionRepository = new TypeORMRatedCriterionRepository(orm),
    weightRepository = new TypeORMWeightRepository(orm),
    ratingRepository = new TypeORMRatingRepository(orm);

  return (
    <ModulesContext.Provider
      value={{
        alternatives: {
          repositories: {
            alternative: alternativeRepository,
            alternativeCategory: alternativeCategoryRepository,
            criterion: criterionRepository,
            ratedCriterion: ratedCriterionRepository,
          },
          useCases: {
            createAlternativeCategory: new CreateAlternativeCategoryUseCase(
              alternativeCategoryRepository,
            ),
            deleteAlternativeCategory: new DeleteAlternativeCategoryByIdUseCase(
              alternativeCategoryRepository,
            ),
            getAlternativeCategoryById: new GetAlternativeCategoryByIdUseCase(
              alternativeCategoryRepository,
            ),
            importAlternativeCategory: new ImportAlternativeCategoryUseCase(
              alternativeCategoryRepository,
              criterionRepository,
            ),
            updateAlternativeCategory: new UpdateAlternativeCategoryUseCase(
              alternativeCategoryRepository,
              criterionRepository,
            ),
          },
        },
        ratings: {
          repositories: {
            rating: ratingRepository,
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
