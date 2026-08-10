/**
 * Purpose: represent monetary amounts without floating-point arithmetic.
 * The smallest currency unit is stored as bigint; formatting is a presentation concern.
 */
export class Money {
  private constructor(
    readonly minor: bigint,
    readonly currency: string,
  ) {}

  static fromMinor(minor: bigint, currency: string): Money {
    if (!currency || !/^[A-Z]{3}$/.test(currency)) throw new Error("Invalid currency");
    return new Money(minor, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.minor + other.minor, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.minor - other.minor, this.currency);
  }

  multiply(factor: bigint): Money {
    return new Money(this.minor * factor, this.currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) throw new Error("Currency mismatch");
  }
}
