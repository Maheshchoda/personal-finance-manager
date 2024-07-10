const CapTrimEnd = (item: string, trimLast: boolean = false) => {
  let result = item.charAt(0).toUpperCase() + item.slice(1);
  if (trimLast) {
    result = result.slice(0, -1);
    return result;
  }
  return result;
};

export default CapTrimEnd;
