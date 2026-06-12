/**
 * Reduction utilities for the Arabic numerical calculation.
 * Provides digit-sum reduction supporting both integers and decimal strings.
 */

export interface ReductionResult {
  finalResult: number;
  steps: number[]; // All intermediate sums until single digit
}

/**
 * Digital root reduction that works on ANY string representation of a number,
 * including decimals (e.g. "708.5" → digits: 7,0,8,5 → 20 → 2+0 → 2).
 *
 * The decimal point itself is IGNORED — only the digit characters are summed.
 *
 * @param val - Number as string (may contain a decimal point)
 * @returns Single-digit result (0-9) and all intermediate sums
 */
export function digitalRoot(val: string): ReductionResult {
  const steps: number[] = [];

  // Extract only digit characters (ignore '.', '-', etc.)
  let current = val
    .replace(/[^0-9]/g, '')   // strip everything except digits
    .split('')
    .reduce((acc, d) => acc + parseInt(d, 10), 0);

  steps.push(current);

  while (current > 9) {
    current = current
      .toString()
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0);
    steps.push(current);
  }

  return {
    finalResult: current,
    steps,
  };
}

/**
 * Reduce a regular integer to a single digit (0-9) by summing its digits.
 */
export function reduceToDigit(num: number): number {
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}

/**
 * Reduce a regular integer to a single digit, returning all intermediate steps.
 */
export function reduceToDigitWithSteps(num: number): { result: number; steps: number[] } {
  const steps: number[] = [num];
  let current = num;
  while (current > 9) {
    current = current
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    steps.push(current);
  }
  return { result: current, steps };
}
