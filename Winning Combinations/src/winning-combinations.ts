
type WinningCombinationsResult = [number, number[]][];
type WinningCombinationsItem = [number, number[]];

function checkCombinations(value: number, lines: number[]): WinningCombinationsItem {
  let result: any[] = [];
  let newLines = lines.map((num, index) => {
    if (!num || num === value) {
      return index;
    }
    return 'X';
  });
  newLines.join('').split('X').forEach((item) => {
    if (item.length > 2) {
      result = item.split('').map((n) => parseInt(n, 10));
    }
  });
  return [value, result];
}

function call(lines: number[]): WinningCombinationsResult {
  const payingSymbols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const unique = [...new Set(lines)];
  const result: WinningCombinationsResult = [];
  unique.forEach((num: number) => {
    if (payingSymbols.includes(num) || unique.length === 1) {
      const combination = checkCombinations(num, lines);
      if (combination[1].length) {
        result.push(combination);
      }
    }
  });
  return result;
}
export const WinningCombinations = { call };
