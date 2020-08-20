const request = (method, url, data) => fetch(url, {
  method,
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
  }
}).then(res => res.json());

export const getNumVideos = filters => (
  request('GET', `/api/videos/count?filters=${encodeURIComponent(JSON.stringify(filters))}`)
);

export const getVideos = (start, end, filters) => (
  request('GET', `/api/videos?start=${start}&end=${end}&filters=${encodeURIComponent(JSON.stringify(filters))}`)
);

// Note: the add,update videos and add,update,delete fields endpoints both support multiple
// but the frontend only supports adding/updating/deleting one at a time, so the following functions
// make it more convenient to do so

export const addVideo = video => request('POST', '/api/videos', [video]);

export const updateVideo = video => request('PUT', '/api/videos', [video]).then(updatedVideos => updatedVideos[0]);

export const deleteVideos = ids => request('DELETE', '/api/videos', ids);

export const getFields = () => request('GET', '/api/fields');

export const addField = field => request('POST', '/api/fields', [field]);

export const updateField = (oldKey, field) => request('PUT', '/api/fields', [{ oldKey, field }])

export const deleteField = key => request('DELETE', '/api/fields', [key]);

export const reorderFields = keys => request('POST', '/api/fields/reorder', keys);
