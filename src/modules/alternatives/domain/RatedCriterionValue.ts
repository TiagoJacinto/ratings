import { type Result, err, ok } from '@/shared/core/Result';
import { ValueObject } from '@/shared/domain/ValueObject';

type RatedCriterionValueProps = {
  value: number;
};

export class RatedCriterionValue extends ValueObject<RatedCriterionValueProps> {
  static readonly MIN = 0;
  static readonly MAX = 10;
  static create(props: RatedCriterionValueProps): Result<RatedCriterionValue, Error> {
    if (props.value > this.MAX)
      return err(new Error(`RatedCriterion value must be less than ${this.MAX}`));
    if (props.value < this.MIN)
      return err(new Error(`RatedCriterion value must be greater than ${this.MIN}`));

    return ok(new this(props));
  }

  get value() {
    return this.props.value;
  }
}
