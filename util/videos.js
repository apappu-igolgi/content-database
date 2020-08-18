export const comparisonOptions = {
  gt: '>',
  lt: '<',
  equals: '=',
  contains: 'contains',
};

export const formatCamelCase = camelCase => {
  const [firstWord, ...remainingWords] = camelCase.split(/(?=[A-Z])/);
  const captialFirstWord = firstWord[0].toUpperCase() + firstWord.slice(1);
  return (captialFirstWord + ' ' + remainingWords.join(' ')).trim();
}

export const capitalize = word => word[0].toUpperCase() + word.slice(1);

export const getKeys = (objects, keysToExclude = []) => {
  if (!Array.isArray(objects)) return [];
  const keys = new Set();
  objects.forEach(obj => {
    Object.keys(obj).forEach(key => {
      keys.add(key);
    })
  });
  keysToExclude.forEach(key => keys.delete(key));
  return Array.from(keys);
};

const request = (method, url, data) => fetch(url, {
  method,
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  }
}).then(res => res.json());

export const getNumVideos = filters => (
  request('GET', `/api/video-count?filters=${encodeURIComponent(JSON.stringify(filters))}`)
);

export const getVideos = (start, end, filters) => (
  request('GET', `/api/videos?start=${start}&end=${end}&filters=${encodeURIComponent(JSON.stringify(filters))}`)
);

export const addVideo = video => request('POST', '/api/add-video', video);

export const updateVideo = video => request('POST', '/api/update-video', video);

export const deleteVideos = ids => request('POST', '/api/delete-videos', ids);

export const getFields = () => request('GET', '/api/fields');

export const addField = field => request('POST', '/api/add-field', field);

export const updateField = (oldKey, field) => request('POST', '/api/update-field', { oldKey, field })

export const deleteField = key => request('POST', '/api/delete-field', { key });

export const reorderFields = keys => request('POST', '/api/reorder-fields', { keys });
