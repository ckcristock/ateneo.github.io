export const lowercaseStatus = (response: any[]) =>
  response.map((data) => {
    let key = '';
    if (data?.state) key = 'state';
    else if (data?.Estado) key = 'Estado';
    else key = 'status';
    if (typeof data[key] === 'string') data[key] = data[key].toLowerCase();
    return data;
  });
