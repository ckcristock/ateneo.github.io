export function setFilters<T>(filters: T): string {
  const params: Partial<T> = {};

  Object.keys(filters).forEach((filter) => {
    if (filters[filter]) {
      params[filter] = filters[filter];
    }
  });

  return `?${Object.keys(params)
    .map((key) => `${key}=${params[key] as string}`)
    .join('&')}`;
}
