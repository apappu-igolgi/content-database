# Design Document
This document contains information about how things are structured and any design decisions made during the creation of this project

**Note: when adding videos to the database from an external script, use the API instead of adding them directly to MongoDB
becuase the API will also take care of creating the necessary fields if there are any new ones in the videos**

## Structures
The following structures can be found in [util/api/index.ts](util/api/index.ts), but are copied here since
they will be referenced throughout this document

#### FieldType
```typescript
"number" | "string" | "image"
```

#### Field
```typescript
{
  key: string, // this key corresponds to the key in a video document
  type: FieldType,
  locked?: boolean, // if the field is locked, it can't be edited (renamed or deleted) from the frontend
}
```

#### Filters
```typescript
{
  [key: string]: {
    '>': number,
    '<': number,
    '=': string | number,
    contains: string | number
  }
}
```

#### Video
- A Video is just an object with arbitrary keys and values
- A valid Video object can only have keys that correspond to the list of fields (with the exception of `_id`)
  - It doesn't need to have all of the fields however

## Database
We use a MongoDB database named `content-database` (doesn't need to be created, MongoDB will do so automatically)
with two collections: `videos` and `fields`

### fields
- Contains a **single** document with a single key `fields` of type [`[Field]`](#field). This is because we want an ordered
array of fields rather than an unordered collection
  ```json
  {
    "fields": [
      {
        "key": "Filename",
        "type": "string",
        "locked": true,
      },
      ...
    ]
  }
  ```

### videos
- A collection of [Video](#video) objects
  ```json
  [
    {
      "Filename" : "Video 1.mp4",
      "Description" : "",
      ...
    },
    ...
  ]
  ```

## Code
- Most of the folder structure has been kept to the default provided by Next.js
  (note: all React components in the pages directory will be turned into a page accessible by /filename
  and all files in pages/api will handle requests to /api/filename)
- When adding a field type to [FieldType](#FieldType), make sure to handle that type in the following places:
  - [components/AddFieldPopup/index.js](components/AddFieldPopup/index.js)
  - [components/AddVideoPopup/index.js](components/AddVideoPopup/index.js)
  - [components/FilterPopup/index.js](components/FilterPopup/index.js)
  - [components/VideoTable/index.js](components/VideoTable/index.js)

### API
- All code related to the API can be found in [pages/api](pages/api), [middleware](middleware), or [util/api](util/api)
- Uses TypeScript
- Endpoints use [Yup](https://github.com/jquense/yup) for validating request body/query
- Endpoint handlers are typically wrapped with the `handleErrors` function from [util/api/index.ts](util/api/index.ts) which will
  respond with a generic 400 Bad Request and an error message if anything throws an error (validation, connection, etc.). The 
  endpoint handler can always choose to handle an error itself and respond with its own more specific error code as well.

#### Files
- [pages/api](pages/api)
  - [fields](pages/api/fields)
    - [index.ts](pages/api/fields/index.ts): handles CRUD operations for fields
    - [reorder.ts](pages/api/fields/reorder.ts): handles endpoint to reorder the fields
    - [lock.ts](pages/api/fields/lock.ts), [unlock.ts](pages/api/fields/unlock.ts): handles locking and unlocking fields
  - [videos](pages/api/videos)
    - [index.ts](pages/api/videos/index.ts): handles CRUD operations for videos
    - [count.ts](pages/api/videos/count.ts): handles retrieval of the video count
- [middleware](middleware)
  - [contentType.ts](middleware/contentType.ts): ensures that all incoming requests use JSON
  - [databse.ts](middleware/database.ts): handles connecting to database and provides a database object to all endponts
  - [index.ts](middleware/index.ts): combines all the middleware (so that enpoints only have to import one file)
- [utils/api/index.ts](utils/api/index.ts): defines types for commonly used structures, [Yup](https://github.com/jquense/yup)
  schema, and any functions that are used by multiple endpoints
  - [yup.ObjectSchema](https://github.com/jquense/yup#typescript-support) is used to ensure that the Yup schemas
    are kept in sync with the TypeScript types


### Frontend
- Uses [React](https://reactjs.org/) with [Hooks](https://reactjs.org/docs/hooks-overview.html),
  [SASS Modules](https://nextjs.org/docs/basic-features/built-in-css-support#sass-support),
  [Material-UI](https://material-ui.com/),
  [react-window](https://github.com/bvaughn/react-window) for the virtualized table,
  and [Formik](https://formik.org/docs/overview) for any forms on the page (typically in popups),
- Currently no global state manager, but may be necessary as project grows. (For future developers: I would recommend 
  [Recoil](https://recoiljs.org/), easiest to add without major refactoring)
- In the table, most of the fields are displayed with the key as the header, and with a width calculated based on the values
  - The 'Thumbnail' field is a hardcoded exception with no header and a fixed width
- Error detection and notifying the user still needs to be implemented
  - When there is an error, the API will respond with a JSON object containing the fields 'name' and 'message'