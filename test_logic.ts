import { calculateArabicPower } from './src/lib/calculate';

const tests = [
    { text: "جيل جميل و كبير و منير", expected: 9 },
    { text: "نور ونوره", expected: null },
    { text: "جار جلال", expected: null },
];

tests.forEach(({ text, expected }) => {
    try {
        const result = calculateArabicPower(text);
        console.log(`Input: ${text}`);
        console.log(`Normalized: ${result.normalized}`);
        console.log(`Char Analysis:`);
        result.charAnalysis.forEach(a => {
            console.log(`  ${a.char}: positions=[${a.positions.join(',')}] sum=${a.positionsSum} → ${a.simplificationSteps.join('→')} = ${a.charValue}`);
        });
        console.log(`Sequence: ${result.sequence.map(s => s.value).join(' + ')}`);
        console.log(`Total Sum: ${result.totalSum}`);
        console.log(`Simplified Base: ${result.simplifiedBaseSteps.join(' → ')} = ${result.simplifiedBase}`);
        console.log(`Power: ${result.powerExpression}`);
        console.log(`Power digits: ${result.powerDigitCount}`);
        console.log(`Power Reduction: ${result.powerReductionSteps.slice(1).join(' → ')}`);
        console.log(`Final Result: ${result.finalReduced}${expected !== null ? ` (Expected: ${expected})` : ''}`);
        console.log('---');
    } catch (e) {
        console.error(`Error for ${text}:`, e);
    }
});
