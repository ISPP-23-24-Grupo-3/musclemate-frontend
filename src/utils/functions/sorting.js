const sum = (array) => {
  if (!Array.isArray(array)) {
    throw new Error("Passed argument is not an array");
  }
  return array.reduce((prev, curr) => {
    if (typeof curr !== "number") {
      throw new Error("Elements inside array are not numbers");
    }
    return prev + curr;
  }, 0);
};

export { sum };
