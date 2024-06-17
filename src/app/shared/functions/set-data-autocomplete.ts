export const mapAutocomplete = (array: any[], text: string, value: string) =>
  array.map((data) => ({ text: data[text], value: data[value] }));
