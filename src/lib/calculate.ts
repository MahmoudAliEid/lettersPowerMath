import { normalizeArabicText, removeDiacritics } from './rules';
import { digitalRoot, reduceToDigit, reduceToDigitWithSteps } from './reduce';

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

/**
 * Step 2 — Character analysis: each unique normalized character,
 * its positions, the position sum, and the simplified value (1-9).
 */
export interface CharAnalysis {
  char: string;                // The normalized character
  normalizedChar: string;      // Same as char (kept for compatibility)
  positions: number[];         // Step 1: all 1-indexed positions where this char appeared
  positionsSum: number;        // Sum of all positions
  simplificationSteps: number[]; // Intermediate steps of digit reduction
  charValue: number;           // Final simplified value (1-9)
}

/**
 * Step 3 — Each position in the original sentence mapped to its simplified value.
 */
export interface SequenceStep {
  char: string;            // Normalized character at this position
  normalizedChar: string;  // Same as char
  position: number;        // 1-indexed position
  value: number;           // The charValue (1-9) from Step 2
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
  totalSum: number;              // Sum of all simplified values (NOT reduced)

  // Step 4: Power calculation
  simplifiedBase: number;        // totalSum reduced to 1-9
  simplifiedBaseSteps: number[]; // Steps of reducing totalSum
  powerExpression: string;       // e.g. "9 ^ 72"
  powerResult: string;           // The huge BigInt result as string
  powerDigitCount: number;       // Number of digits in the power result
  powerReductionSteps: string[]; // Steps of reducing the power result
  finalReduced: number;          // Final single digit (1-9)
}

// ─────────────────────────────────────────────────────────────
// Main calculation function
// ─────────────────────────────────────────────────────────────

/**
 * Calculates the Arabic Jafr (الجفر العددي) value using the 4-step algorithm:
 *
 * **Step 1 — Decomposition & Numbering:**
 *   Break the sentence into individual normalized letters.
 *   Assign each a sequential index starting from 1.
 *
 * **Step 2 — Position Sum & Simplification:**
 *   For each unique letter, sum all positions where it appeared.
 *   Simplify the sum to a single digit (1-9) by repeatedly summing digits.
 *
 * **Step 3 — Substitution & Total:**
 *   Replace each letter in the original sentence with its simplified value.
 *   Sum all values to get the "total" (displayed as-is, NOT simplified).
 *
 * **Step 4 — Power & Final Reduction:**
 *   Simplify the total to a single digit → "simplified base".
 *   Compute: simplified_base ^ total using BigInt.
 *   Simplify the huge result (digit sum) to a single digit (1-9).
 */
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

  // ── Step 2: Sum positions & simplify to 1-9 ──
  const charValueMap = new Map<string, number>();
  const charAnalysisMap = new Map<string, CharAnalysis>();
  const charAnalysis: CharAnalysis[] = [];

  const seenChars = new Set<string>();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (!seenChars.has(char)) {
      const positions = normalizedCharToPositions.get(char)!;
      // Sum all positions
      const positionsSum = positions.reduce((acc, pos) => acc + pos, 0);
      // Simplify to single digit
      const simplification = reduceToDigitWithSteps(positionsSum);

      charValueMap.set(char, simplification.result);
      const analysis: CharAnalysis = {
        char,
        normalizedChar: char,
        positions,
        positionsSum,
        simplificationSteps: simplification.steps,
        charValue: simplification.result,
      };
      charAnalysisMap.set(char, analysis);
      charAnalysis.push(analysis);
      seenChars.add(char);
    }
  }

  // ── Step 3: Substitution & total sum ──
  const sequence: SequenceStep[] = [];
  let totalSum = 0;

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const pos = i + 1;
    const value = charValueMap.get(char)!;

    sequence.push({
      char,
      normalizedChar: char,
      position: pos,
      value,
    });

    totalSum += value;
  }

  // ── Step 4: Power calculation & final reduction ──

  // 4a. Simplify totalSum to single digit = "simplified base"
  const baseSimplification = reduceToDigitWithSteps(totalSum);
  const simplifiedBase = baseSimplification.result;

  // 4b. Compute: simplifiedBase ^ totalSum using BigInt
  const baseBig = BigInt(simplifiedBase);
  const exponent = BigInt(totalSum);
  const powerResult = baseBig ** exponent;
  const powerResultStr = powerResult.toString();

  // 4c. Simplify the huge power result to a single digit
  const powerReduction = digitalRoot(powerResultStr);

  return {
    original: text,
    normalized,
    charAnalysis,
    sequence,
    totalSum,
    simplifiedBase,
    simplifiedBaseSteps: baseSimplification.steps,
    powerExpression: `${simplifiedBase} ^ ${totalSum}`,
    powerResult: powerResultStr,
    powerDigitCount: powerResultStr.length,
    powerReductionSteps: powerReduction.steps,
    finalReduced: powerReduction.finalResult,
  };
}