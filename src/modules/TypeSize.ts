/**
 * TypeSize - A simplified wrapper around type sizes that can handle both fixed and scalable vectors
 * Based on LLVM's TypeSize.h implementation
 */

export class TypeSize {
	private readonly _fixedValue: number;
	private readonly _isScalable: boolean;

	/**
	 * Private constructor - use static factory methods instead
	 */
	private constructor(fixedValue: number, isScalable: boolean) {
		this._fixedValue = fixedValue;
		this._isScalable = isScalable;
	}

	/**
	 * Create a TypeSize with a fixed value (not scalable)
	 */
	static getFixed(fixedValue: number): TypeSize {
		return new TypeSize(fixedValue, false);
	}

	/**
	 * Create a TypeSize with a scalable value (scaled by vscale)
	 */
	static getScalable(scalableValue: number): TypeSize {
		return new TypeSize(scalableValue, true);
	}

	/**
	 * Create a TypeSize with both fixed and scalable components
	 */
	static get(fixedValue: number, scalableValue: number): TypeSize {
		// For simplicity, we'll use the fixed value and mark as scalable if scalableValue > 0
		return new TypeSize(fixedValue, scalableValue > 0);
	}

	/**
	 * Get the fixed component of the size
	 */
	getFixedValue(): number {
		return this._fixedValue;
	}

	/**
	 * Returns whether the size is scaled by a runtime quantity (vscale)
	 */
	isScalable(): boolean {
		return this._isScalable;
	}

	/**
	 * Returns true if the size is not scaled by vscale
	 */
	isFixed(): boolean {
		return !this._isScalable;
	}

	/**
	 * Returns the minimum value this size can represent
	 */
	getKnownMinValue(): number {
		return this._fixedValue;
	}

	/**
	 * Check if the size is zero
	 */
	isZero(): boolean {
		return this._fixedValue === 0;
	}

	/**
	 * Check if the size is non-zero
	 */
	isNonZero(): boolean {
		return this._fixedValue !== 0;
	}

	/**
	 * Boolean conversion - returns true if non-zero
	 */
	valueOf(): boolean {
		return this.isNonZero();
	}

	/**
	 * A return value of true indicates we know at compile time that the number
	 * of elements (vscale * Min) is definitely even
	 */
	isKnownEven(): boolean {
		return (this.getKnownMinValue() & 0x1) === 0;
	}

	/**
	 * Check if the size is known to be a multiple of the given value
	 */
	isKnownMultipleOf(rhs: number): boolean {
		return rhs !== 0 && this.getKnownMinValue() % rhs === 0;
	}

	/**
	 * Check if this size is known to be a multiple of another TypeSize
	 */
	isKnownMultipleOfTypeSize(rhs: TypeSize): boolean {
		if (rhs.isZero()) return false;
		if (this.isScalable() !== rhs.isScalable()) return false;
		return this.getKnownMinValue() % rhs.getKnownMinValue() === 0;
	}

	/**
	 * Add another TypeSize to this one
	 */
	add(rhs: TypeSize): TypeSize {
		if (this.isScalable() !== rhs.isScalable() && !this.isZero() && !rhs.isZero()) {
			throw new Error("Cannot add incompatible TypeSize values (one scalable, one fixed)");
		}

		const newFixed = this._fixedValue + rhs._fixedValue;
		const newScalable = this._isScalable || rhs._isScalable;

		return new TypeSize(newFixed, newScalable);
	}

	/**
	 * Subtract another TypeSize from this one
	 */
	subtract(rhs: TypeSize): TypeSize {
		if (this.isScalable() !== rhs.isScalable() && !this.isZero() && !rhs.isZero()) {
			throw new Error("Cannot subtract incompatible TypeSize values (one scalable, one fixed)");
		}

		const newFixed = this._fixedValue - rhs._fixedValue;
		const newScalable = this._isScalable || rhs._isScalable;

		return new TypeSize(newFixed, newScalable);
	}

	/**
	 * Multiply this TypeSize by a scalar value
	 */
	multiply(scalar: number): TypeSize {
		return new TypeSize(this._fixedValue * scalar, this._isScalable);
	}

	/**
	 * Divide this TypeSize by a scalar value
	 */
	divide(scalar: number): TypeSize {
		if (scalar === 0) {
			throw new Error("Cannot divide by zero");
		}
		return new TypeSize(Math.floor(this._fixedValue / scalar), this._isScalable);
	}

	/**
	 * Get the negative of this TypeSize
	 */
	negate(): TypeSize {
		return new TypeSize(-this._fixedValue, this._isScalable);
	}

	/**
	 * Check if this TypeSize equals another
	 */
	equals(rhs: TypeSize): boolean {
		return this._fixedValue === rhs._fixedValue && this._isScalable === rhs._isScalable;
	}

	/**
	 * Check if this TypeSize is less than another
	 * Note: This is only meaningful for fixed sizes
	 */
	isKnownLessThan(rhs: TypeSize): boolean {
		if (this.isScalable() || rhs.isScalable()) {
			return false; // Cannot compare scalable sizes
		}
		return this._fixedValue < rhs._fixedValue;
	}

	/**
	 * Check if this TypeSize is greater than another
	 * Note: This is only meaningful for fixed sizes
	 */
	isKnownGreaterThan(rhs: TypeSize): boolean {
		if (this.isScalable() || rhs.isScalable()) {
			return false; // Cannot compare scalable sizes
		}
		return this._fixedValue > rhs._fixedValue;
	}

	/**
	 * Check if this TypeSize is less than or equal to another
	 * Note: This is only meaningful for fixed sizes
	 */
	isKnownLessThanOrEqual(rhs: TypeSize): boolean {
		if (this.isScalable() || rhs.isScalable()) {
			return false; // Cannot compare scalable sizes
		}
		return this._fixedValue <= rhs._fixedValue;
	}

	/**
	 * Check if this TypeSize is greater than or equal to another
	 * Note: This is only meaningful for fixed sizes
	 */
	isKnownGreaterThanOrEqual(rhs: TypeSize): boolean {
		if (this.isScalable() || rhs.isScalable()) {
			return false; // Cannot compare scalable sizes
		}
		return this._fixedValue >= rhs._fixedValue;
	}

	/**
	 * Get a string representation of this TypeSize
	 */
	toString(): string {
		if (this._isScalable) {
			return `${this._fixedValue} * vscale`;
		}
		return this._fixedValue.toString();
	}
}
