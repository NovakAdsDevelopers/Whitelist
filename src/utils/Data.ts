const deepMerge = (obj1: any, obj2: any): any => {
  const output = Object.assign({}, obj1);

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && obj1[key]) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }

  return output;
};

const generateUniqueToken = (): string => {
  const timestamp: number = new Date().getTime();
  const randomString: string = Math.random().toString(36).substring(2, 8); // Random string of length 6

  return `${timestamp}-${randomString}`;
};

const toBrazilISODate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds()
  );

  // Força timezone do Brasil (GMT-3)
  const timezoneOffset = 3 * 60 * 60 * 1000;
  const brasilDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000 - timezoneOffset);

  return brasilDate.toISOString();
};

export { deepMerge, generateUniqueToken, toBrazilISODate };
