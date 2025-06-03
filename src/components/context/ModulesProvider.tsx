import React, { useContext } from 'react';

import { TypeORMRatingRepository } from '@/modules/ratings/repositories/rating/implementations/TypeORMRatingRepository';
import { type RatingRepository } from '@/modules/ratings/repositories/rating/rating.repository';
import { TypeORMAlternativeCategoryRepository } from '@/modules/alternatives/repositories/alternative-category/implementations/TypeORMAlternativeCategoryRepository';
import { type AlternativeCategoryRepository } from '@/modules/alternatives/repositories/alternative-category/alternative-category.repository';
import { TypeORMAlternativeRepository } from '@/modules/alternatives/repositories/alternative/implementations/TypeORMAlternativeRepository';
import { TypeORMCriterionRepository } from '@/modules/alternatives/repositories/criterion/implementations/TypeORMCriterionRepository';
import { type CriterionRepository } from '@/modules/alternatives/repositories/criterion/criterion.repository';
import { type WeightRepository } from '@/modules/ratings/repositories/weight/weight.repository';
import { TypeORMWeightRepository } from '@/modules/ratings/repositories/weight/implementations/TypeORMWeightRepository';
import { type AlternativeRepository } from '@/modules/alternatives/repositories/alternative/alternative.repository';
import { type RatedCriterionRepository } from '@/modules/alternatives/repositories/rated-criterion/rated-criterion.repository';
import { TypeORMRatedCriterionRepository } from '@/modules/alternatives/repositories/rated-criterion/implementations/TypeORMRatedCriterionRepository';
import { CreateAlternativeCategoryUseCase } from '@/modules/alternatives/use-cases/create-alternative-category/create-alternative-category.use-case';
import { DeleteAlternativeCategoryByIdUseCase } from '@/modules/alternatives/use-cases/delete-alternative-category-by-id/delete-alternative-category-by-id..use-case';
import { GetAlternativeCategoryByIdUseCase } from '@/modules/alternatives/use-cases/get-alternative-category/get-alternative-category-by-id.use-case';
import { ImportAlternativeCategoryUseCase } from '@/modules/alternatives/use-cases/import-alternative-category/import-alternative-category.use-case';
import { UpdateAlternativeCategoryUseCase } from '@/modules/alternatives/use-cases/update-alternative-category/update-alternative-category.use-case';
import { CreateAlternativeCategoryController } from '@/modules/alternatives/use-cases/create-alternative-category/create-alternative-category.controller';
import { DeleteAlternativeCategoryController } from '@/modules/alternatives/use-cases/delete-alternative-category-by-id/delete-alternative-category-by-id.controller';
import { GetAlternativeCategoryController } from '@/modules/alternatives/use-cases/get-alternative-category/get-alternative-category-by-id.controller';
import { ImportAlternativeCategoryController } from '@/modules/alternatives/use-cases/import-alternative-category/import-alternative-category.controller';
import { UpdateAlternativeCategoryController } from '@/modules/alternatives/use-cases/update-alternative-category/update-alternative-category.controller';

import { useStorage } from './StorageProvider';

type ModulesContext = Readonly<{
  alternatives: {
    controllers: {
      createAlternativeCategory: CreateAlternativeCategoryController;
      deleteAlternativeCategory: DeleteAlternativeCategoryController;
      getAlternativeCategoryById: GetAlternativeCategoryController;
      importAlternativeCategory: ImportAlternativeCategoryController;
      updateAlternativeCategory: UpdateAlternativeCategoryController;
    };
    repositories: {
      alternative: AlternativeRepository;
      alternativeCategory: AlternativeCategoryRepository;
      criterion: CriterionRepository;
      ratedCriterion: RatedCriterionRepository;
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
  const orm = useStorage();

  const repositories = {
    alternative: new TypeORMAlternativeRepository(orm),
    alternativeCategory: new TypeORMAlternativeCategoryRepository(orm),
    criterion: new TypeORMCriterionRepository(orm),
    ratedCriterion: new TypeORMRatedCriterionRepository(orm),
    rating: new TypeORMRatingRepository(orm),
    weight: new TypeORMWeightRepository(orm),
  };

  const useCases = {
    createAlternativeCategory: new CreateAlternativeCategoryUseCase(
      repositories.alternativeCategory,
      repositories.criterion,
    ),
    deleteAlternativeCategory: new DeleteAlternativeCategoryByIdUseCase(
      repositories.alternativeCategory,
    ),
    getAlternativeCategoryById: new GetAlternativeCategoryByIdUseCase(
      repositories.alternativeCategory,
    ),
    importAlternativeCategory: new ImportAlternativeCategoryUseCase(
      repositories.alternativeCategory,
      repositories.criterion,
    ),
    updateAlternativeCategory: new UpdateAlternativeCategoryUseCase(
      repositories.alternativeCategory,
      repositories.criterion,
    ),
  };

  return (
    <ModulesContext.Provider
      value={{
        alternatives: {
          controllers: {
            createAlternativeCategory: new CreateAlternativeCategoryController(
              useCases.createAlternativeCategory,
            ),
            deleteAlternativeCategory: new DeleteAlternativeCategoryController(
              useCases.deleteAlternativeCategory,
            ),
            getAlternativeCategoryById: new GetAlternativeCategoryController(
              useCases.getAlternativeCategoryById,
            ),
            importAlternativeCategory: new ImportAlternativeCategoryController(
              useCases.importAlternativeCategory,
            ),
            updateAlternativeCategory: new UpdateAlternativeCategoryController(
              useCases.updateAlternativeCategory,
            ),
          },
          repositories: {
            alternative: repositories.alternative,
            alternativeCategory: repositories.alternativeCategory,
            criterion: repositories.criterion,
            ratedCriterion: repositories.ratedCriterion,
          },
        },
        ratings: {
          repositories: {
            rating: repositories.rating,
            weight: repositories.weight,
          },
        },
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
}

export const useModules = () => useContext(ModulesContext);
