import { expect, test } from "vitest";
import { sum } from "./sorting";

test.each([
  [[2 ** 32, 2 ** 32], 2 ** 33],
  [[1, 2], 3],
  [[], 0],
])("sum(%o) -> %i", (array, expected) => {
  expect(sum(array)).toBe(expected);
});

test.each([[undefined], [false], [null], [{}], ["test"], [0]])(
  "sum(%o) -> Invalid argument",
  (arg) => {
    expect(() => sum(arg)).toThrow("Passed argument is not an array");
  }
);

test.each([[["a", "b"]], [[null]], [[undefined]], [[{ array: [0] }]]])(
  "sum(%o) -> error",
  (arg) => {
    expect(() => sum(arg)).toThrow("Elements inside array are not numbers");
  }
);
