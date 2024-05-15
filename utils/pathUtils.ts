export function getRelativePath(fistPath: string, fullPath: string) {
  let url = fistPath + fullPath.split(fistPath)[1];
  return url;
}
