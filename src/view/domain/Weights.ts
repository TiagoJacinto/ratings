import { type WithId } from '../utils/toFieldArray';
import { type Id } from './Id';
import { type Weight } from './Weight';
import { WeightValue } from './WeightValue';

export const total = (weights: Weight[]) => weights.reduce((sum, w) => sum + w.value, 0);

type FormWeight = WithId<Weight & { criterionId: Id }>;

export const actions = (weights: FormWeight[]) => ({
  addNew: (weight: FormWeight) => [...weights, weight],
  changeValue: (weight: FormWeight, newValue: number) => {
    const previousValue = weight.value;

    if (
      previousValue === newValue ||
      Math.ceil(newValue) < WeightValue.MIN ||
      Math.floor(newValue) > WeightValue.MAX
    )
      return weights;

    if (newValue === WeightValue.MAX) {
      return weights.map((w) => ({
        ...w,
        value: w.id === weight.id ? WeightValue.MAX : WeightValue.MIN,
      }));
    }

    const newRest = WeightValue.MAX - newValue;

    if (weight.value === WeightValue.MAX) {
      return weights.map((w) => {
        const isOtherWeight = weight.id !== w.id;

        return isOtherWeight
          ? {
              ...w,
              value: newRest / (weights.length - 1),
            }
          : { ...w, value: newValue };
      });
    }

    const oldRest = WeightValue.MAX - weight.value;

    return weights.map((w) => {
      const isOtherWeight = weight.id !== w.id;

      if (isOtherWeight) {
        if (w.value === 0) return w;

        const ratio = w.value / oldRest;
        return {
          ...w,
          value: ratio * newRest,
        };
      }

      return {
        ...w,
        value: newValue,
      };
    });
  },
  fixTotal: () => {
    if (weights.length === 0 || total(weights) === WeightValue.MAX) return weights;

    const missingWeightValue = WeightValue.MAX - total(weights);

    weights = weights.map((w) => ({
      ...w,
      value: w.value + missingWeightValue / weights.length,
    }));

    if (total(weights) === WeightValue.MAX) return weights;

    const deviation = total(weights) - WeightValue.MAX;

    // eslint-disable-next-line sonarjs/pseudo-random
    const randomIndex = Math.floor(Math.random() * weights.length);
    weights[randomIndex] = {
      ...weights[randomIndex]!,
      value: weights[randomIndex]!.value - deviation,
    };

    return weights;
  },
  remove: (index: number) => actions(weights.filter((_, i) => i !== index)).fixTotal(),
});
