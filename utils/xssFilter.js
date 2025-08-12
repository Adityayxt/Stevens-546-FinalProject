import xss from 'xss';


function xssClean(data) {
  if (typeof data === 'string') {
    return xss(data);
  }

  if (typeof data === 'object' && data !== null) {
    const cleaned = {};
    for (const key in data) {
      if (typeof data[key] === 'string') {
        cleaned[key] = xss(data[key]);
      } else {
        cleaned[key] = data[key];
      }
    }
    return cleaned;
  }

  // Return other types as-is
  return data;
}

export { xssClean };