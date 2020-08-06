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
