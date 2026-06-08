import { normalizeArabicText, removeDiacritics } from './rules';
import { digitalRoot, reduceToDigitWithSteps } from './reduce';

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

/**
 * Step 2 — Character analysis: each unique normalized character,
 * its positions, and the position sum (NO SIMPLIFICATION in Step 2).
 */
export interface CharAnalysis {
  char: string;                // The normalized character
  normalizedChar: string;      // Same as char (kept for compatibility)
  positions: number[];         // Step 1: all 1-indexed positions where this char appeared
  positionsSum: number;        // Sum of all positions (NOT simplified)
  charValue: number;           // Same as positionsSum
}

/**
 * Step 3 — Each position in the original sentence mapped to its multiplied value.
 */
export interface SequenceStep {
  char: string;            // Normalized character at this position
  normalizedChar: string;  // Same as char
  position: number;        // 1-indexed position
  charValue: number;       // The positionsSum from Step 2
  value: number;           // Step 3 value: position * charValue
}

/**
 * Complete calculation result across all 4 steps.
 */
export interface CalculationResult {
  // Original & normalized text
  original: string;
  normalized: string;

  // Step 1 + 2: Character analysis
  charAnalysis: CharAnalysis[];

  // Step 3: Substitution sequence and total
  sequence: SequenceStep[];
  step3Sum: number;              // Sum of all Step 3 values

  // Step 4: Power calculation
  step4Reduced: number;          // step3Sum reduced to 1-9
  step4ReducedSteps: number[];   // Steps of reducing step3Sum
  powerExpression: string;       // e.g. "5 ^ 797"
  powerResult: string;           // The huge BigInt result as string
  powerDigitCount: number;       // Number of digits in the power result
  powerReductionSteps: string[]; // Steps of reducing the power result
  finalReduced: number;          // Final single digit (1-9)
}

// ─────────────────────────────────────────────────────────────
// Main calculation function
// ─────────────────────────────────────────────────────────────

export function calculateArabicPower(text: string): CalculationResult {
  // ── Validation ──
  const basicCleaned = removeDiacritics(text).replace(/\s+/g, '');
  if (basicCleaned.length === 0) {
    throw new Error('Input must contain Arabic characters');
  }

  // ── Step 0: Normalize ──
  const normalized = normalizeArabicText(text);

  // ── Step 1: Decompose & Number ──
  // Map each unique normalized char to all positions it occupies
  const normalizedCharToPositions = new Map<string, number[]>();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const pos = i + 1; // 1-indexed
    if (!normalizedCharToPositions.has(char)) {
      normalizedCharToPositions.set(char, []);
    }
    normalizedCharToPositions.get(char)!.push(pos);
  }

  // ── Step 2: Sum positions (NO simplification) ──
  const charValueMap = new Map<string, number>();
  const charAnalysisMap = new Map<string, CharAnalysis>();
  const charAnalysis: CharAnalysis[] = [];

  const seenChars = new Set<string>();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (!seenChars.has(char)) {
      const positions = normalizedCharToPositions.get(char)!;
      // Sum all positions WITHOUT simplifying
      const positionsSum = positions.reduce((acc, pos) => acc + pos, 0);

      charValueMap.set(char, positionsSum);
      const analysis: CharAnalysis = {
        char,
        normalizedChar: char,
        positions,
        positionsSum,
        charValue: positionsSum,
      };
      charAnalysisMap.set(char, analysis);
      charAnalysis.push(analysis);
      seenChars.add(char);
    }
  }

  // ── Step 3: Multiplication & total sum ──
  const sequence: SequenceStep[] = [];
  let step3Sum = 0;

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const pos = i + 1;
    const charValue = charValueMap.get(char)!;
    const multipliedValue = pos * charValue;

    sequence.push({
      char,
      normalizedChar: char,
      position: pos,
      charValue,
      value: multipliedValue,
    });

    step3Sum += multipliedValue;
  }

  // ── Step 4: Power calculation & final reduction ──

  // 4a. Simplify step3Sum to single digit
  const baseSimplification = reduceToDigitWithSteps(step3Sum);
  const step4Reduced = baseSimplification.result;

  // 4b. Compute: step4Reduced ^ step3Sum using BigInt
  const baseBig = BigInt(step4Reduced);
  const exponent = BigInt(step3Sum);
  const powerResult = baseBig ** exponent;
  const powerResultStr = powerResult.toString();

  // 4c. Simplify the huge power result to a single digit
  const powerReduction = digitalRoot(powerResultStr);

  return {
    original: text,
    normalized,
    charAnalysis,
    sequence,
    step3Sum,
    step4Reduced,
    step4ReducedSteps: baseSimplification.steps,
    powerExpression: `${step4Reduced} ^ ${step3Sum}`,
    powerResult: powerResultStr,
    powerDigitCount: powerResultStr.length,
    powerReductionSteps: powerReduction.steps,
    finalReduced: powerReduction.finalResult,
  };
}