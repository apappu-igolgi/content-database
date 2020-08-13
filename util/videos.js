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

export const fieldNameToKey = name => {
  const [firstWord, ...remainingWords] = name.split(' ');
  const key = firstWord.toLowerCase() + remainingWords.map(word => capitalize(word.toLowerCase())).join('');
  return key.replace(/[\-'"\)\(]/g, ''); // remove any special characters
}

export const getNumVideos = filters => (
  fetch(`/api/video-count?filters=${encodeURIComponent(JSON.stringify(filters))}`).then(res => res.json())
);

export const getVideos = (start, end, filters) => (
  fetch(`/api/videos?start=${start}&end=${end}&filters=${encodeURIComponent(JSON.stringify(filters))}`).then(res => res.json())
);

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

export const addVideo = video => fetch('/api/add-video', {
  method: 'POST',
  body: JSON.stringify(video),
}).then(res => res.json());

export const updateVideo = video => fetch('/api/update-video', {
  method: 'POST',
  body: JSON.stringify(video),
}).then(res => res.json());

export const deleteVideos = ids => fetch('/api/delete-videos', {
  method: 'POST',
  body: JSON.stringify(ids) 
}).then(res => res.json());

export const getFields = () => fetch('/api/fields').then(res => res.json());

export const addField = ({ name, type }) => fetch('/api/add-field', {
  method: 'POST',
  body: JSON.stringify({ key: fieldNameToKey(name), name, type }),
}).then(res => res.json());

export const deleteField = key => fetch('/api/delete-field', {
  method: 'POST',
  body: JSON.stringify({ key }),
}).then(res => res.json());

export const reorderFields = keys => fetch('/api/reorder-fields', {
  method: 'POST',
  body: JSON.stringify({ keys })
}).then(res => res.json());