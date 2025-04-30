import { err, ok, type Result } from '@/shared/core/Result';
import { ValueObject } from '@/shared/domain/ValueObject';

type WeightValueProps = {
  value: number;
};

export class WeightValue extends ValueObject<WeightValueProps> {
  get value() {
    return this.props.value;
  }

  static readonly MIN = 0;
  static readonly MAX = 100;
  static readonly MAX_FRACTION_DIGITS = 1;

  static create(props: WeightValueProps): Result<WeightValue, Error> {
    if (props.value > this.MAX) return err(new Error(`Weight value must be less than ${this.MAX}`));
    if (props.value < this.MIN)
      return err(new Error(`Weight value must be greater than ${this.MIN}`));

    props.value = +props.value.toFixed(this.MAX_FRACTION_DIGITS);

    return ok(new this(props));
  }
}
