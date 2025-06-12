const roundToTwo = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const stringifyPrice = (price: any | number | bigint) => {
  const valToStringify =
    price && roundToTwo(Number(price)) && roundToTwo(Number(price)).toString().split('.')[0];
  const rev: any[] = valToStringify && valToStringify.toString().split('').reverse();

  const newPrice: any = [];
  for (let i = 0; i < rev?.length; i++) {
    if (rev?.length > 3 && i + 1 !== rev?.length && (i + 1) % 3 === 0 && i + 1 >= 3) {
      newPrice.push(rev[i], ',');
    } else {
      newPrice.push(rev[i]);
    }
  }

  const secondString = price && roundToTwo(Number(price)).toString().split('.')[1];
  return `${newPrice.reverse().join('') || 0}${
    secondString ? `.${(secondString || '')?.padEnd(2, '0') || '00'}` : ''
  }`;
  // return `${newPrice.reverse().join("")}`;
};
