const addSum = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof a !== "number" || typeof b !== "number") {
        reject("a,b must be number!");
      }

      resolve(a + b);
    }, 1000);
  });
};

// addSum(10, 10)
//   .then((sum) => {
//     return addSum(sum, 10);
//   })
//   .then((sum) => console.log({ sum }))
//   .catch((error) => ({ error }));

const total = async () => {
  try {
    const sum = await addSum(10, 20);
    const sum2 = await addSum(sum, 30);
    console.log({ sum, sum2 });
  } catch (error) {
    if (error) return console.log({ error });
  }
};

console.log(total());
