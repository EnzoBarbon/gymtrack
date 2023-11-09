export function flattenDic<T>(dic: any): T[] {
  const flatteneed: T[] = [];
  Object.keys(dic).forEach((key) => {
    flatteneed.push(dic[key]);
  });
  console.log(flatteneed);
  return flatteneed;
}

export function indexBy<T>(
  array: T[],
  selector: (value: T) => string
): { [key: string]: T } {
  const dic: { [key: string]: T } = {};
  array.forEach((value) => {
    dic[selector(value)] = value;
  });
  return dic;
}

export function groupBy<T>(
  array: T[],
  selector: (value: T) => string
): { [key: string]: T[] } {
  const result: { [key: string]: T[] } = {};

  array.forEach((value) => {
    const key = selector(value);
    if (result[key]) {
      result[key] = [...result[key], value];
    } else {
      result[key] = [value];
    }
  });

  return result;
}
