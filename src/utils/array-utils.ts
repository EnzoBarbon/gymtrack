export function flattenDic<T>(dic: any): T[] {
  const flatteneed: T[] = [];
  Object.keys(dic).forEach((key) => {
    flatteneed.push(dic[key]);
  });
  console.log(flatteneed);
  return flatteneed;
}
