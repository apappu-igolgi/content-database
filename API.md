# Content Database API Documentation
**Base URL: /api/**

Make sure that all non-GET requests specify the header `Content-Type: 'application/json'`

## Videos

### /videos/count

#### GET

##### Description

Get the number of videos in the database.

If `filters` are provided, gets the number of videos that satisfy those filters.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| filters | query | make sure that the JSON is URL encoded. | No | [Filters](#filtes) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*text/plain*):<br><pre>1001</pre> | integer |

### /videos

#### GET

##### Description

Gets the video objects in the specified range from `start` to `end` (inclusive).

If `filters` are provided (in JSON format), will apply those filters first, then get the provided range.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start | query |  | Yes | integer |
| end | query |  | Yes | integer |
| filters | query | make sure that the JSON is URL encoded. | No | [Filters](#filters) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "_id": "5f3e3ce673f25b6743e3b8f4",<br>    "Thumbnail": "",<br>    "Filename": "Video 1.mp4",<br>    "Description": "",<br>    "Stream Type": "SPTS",<br>    "File Format": "Transport Stream",<br>    "Resolution": "1280x720",<br>    "Codec": "MPEG-2",<br>    "Aspect Ratio": 243,<br>    "Frame Rate": 13<br>  },<br>  {<br>    "_id": "5f3e3ce673f25b6743e3b8fd",<br>    "Thumbnail": "",<br>    "Filename": "Video 10.mp4",<br>    "Description": "",<br>    "Stream Type": "MPTS",<br>    "File Format": "Transport Stream",<br>    "Resolution": "1280x720",<br>    "Codec": "MPEG-4",<br>    "Aspect Ratio": 969,<br>    "Frame Rate": 13<br>  }<br>]</pre> | [ [Video](#video) ] |

#### POST

##### Description

Given a list of video objects, adds all of them to the database (note that the video can specify as few or as many fields as desired). If there are any new fields in any of the provided videos, also adds those fields to the fields collection in the database.

Returns the new total video count (after adding the provided videos).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ [Video](#video) ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*text/plain*):<br><pre>1002</pre> | integer |

#### PUT

##### Description

Given a list of video objects, updates each one by adding/modifying the specified fields.
The `_id` field must be specified in each object in order to identify which video to update.

Note that this does not replace the entire video object by the provided one, the updates are done on a field by field basis.

Returns a list of the complete updated videos (since the provided videos may only have values for the fields that need to be updated).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ [Video](#video) ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "_id": "5f3cb4c0731d513d5471f8a0",<br>    "Filename": "hello world!",<br>    "Description": "This is the description."<br>  },<br>  {<br>    "_id": "5f3e3ce673f25b6743e3b8f4",<br>    "Filename": "Video 2.mp4",<br>    "Description": "Lorem ipsum dolor"<br>  }<br>]</pre> | [ [Video](#video) ] |

#### DELETE

##### Description

Given a list of video ids, deletes the corresponding videos.

Returns the new total video count (after deletion).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ string ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*text/plain*):<br><pre>998</pre> | integer |

## Fields

### /fields

#### GET

##### Description

Get the list of fields.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "key": "Filename",<br>    "type": "string",<br>    "locked": true<br>  },<br>  {<br>    "key": "Description",<br>    "type": "string",<br>    "locked": true<br>  }<br>]</pre> | [ [Field](#field) ] |

#### POST

##### Description

Given a list of fields, checks to make sure all the keys are unique, and add them to the database.

Returns list of all fields, including the ones just added.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ [Field](#field) ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "key": "Filename",<br>    "type": "string",<br>    "locked": true<br>  },<br>  {<br>    "key": "Description",<br>    "type": "string",<br>    "locked": true<br>  },<br>  {<br>    "key": "test1",<br>    "type": "number"<br>  },<br>  {<br>    "key": "test2",<br>    "type": "image"<br>  }<br>]</pre> | [ [Field](#field) ] |

#### PUT

##### Description

Given a list of objects with properties `oldKey` and `field`, updates the field with `oldKey` with the properties of the given field. Both the `key` and `type` must be specified on `field`. Only unlocked fields can be updated.

Also goes through each videos and replaces the old field key with the new one.

Returns the complete list of fields after updating.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ [FieldsRequest](#fieldsrequest) ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "key": "Filename",<br>    "type": "string",<br>    "locked": true<br>  },<br>  {<br>    "key": "Description",<br>    "type": "string",<br>    "locked": true<br>  },<br>  {<br>    "key": "renamed1",<br>    "type": "string"<br>  },<br>  {<br>    "key": "test2",<br>    "type": "number"<br>  }<br>]</pre> | [ [Field](#field) ] |

#### DELETE

##### Description

Given a list of field keys, deletes the corresponding fields. Only unlocked fields can be deleted.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ string ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "key": "Filename",<br>    "type": "string",<br>    "locked": true<br>  },<br>  {<br>    "key": "Description",<br>    "type": "string",<br>    "locked": true<br>  }<br>]</pre> | [ [Field](#field) ] |

### /fields/lock

#### POST

##### Description

Given a list of field keys, locks the corresponding fields.

Returns complete list of fields after locking.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ string ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "key": "Thumbnail",<br>    "type": "image",<br>    "locked": true<br>  },<br>  {<br>    "key": "Filename",<br>    "type": "string",<br>    "locked": true<br>  },<br>  {<br>    "key": "Description",<br>    "type": "string",<br>    "locked": true<br>  }<br>]</pre> | [ [Field](#field) ] |

### /fields/unlock

#### POST

##### Description

Given a list of field keys, unlocks the corresponding fields.

Returns complete list of fields after unlocking.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [ string ] |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | OK<br><br>**Example** (*application/json*):<br><pre>[<br>  {<br>    "key": "Thumbnail",<br>    "type": "image",<br>    "locked": true<br>  },<br>  {<br>    "key": "Filename",<br>    "type": "string",<br>    "locked": false<br>  },<br>  {<br>    "key": "Description",<br>    "type": "string",<br>    "locked": false<br>  }<br>]</pre> | [ [Field](#field) ] |

### Models

#### Filters
You can specify as many keys as necessary, corresponding to the field keys

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| key1 | [Filter](#filter) |  | No |
| key2 | [Filter](#filter) |  | No |
| key3 | [Filter](#filter) |  | No |
| keyN | [Filter](#filter) |  | No |

Example:
```
{
  "Filename": {
    "contains": "1"
  },
  "Frame Rate": {
    "<": 30,
    ">": 5
  }
}
```

#### Filter

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| > | double |  | No |
| < | double |  | No |
| = | object |  | No |
| contains | string |  | No |

#### Video

The object contains key value pairs for (up to) every defined field

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| _id | string |  | No |

Example:
```
{
  "_id": "5f3e3ce673f25b6743e3b8f4",
  "Thumbnail": "",
  "Filename": "Video 1.mp4",
  "Description": "",
  "Stream Type": "SPTS",
  "File Format": "Transport Stream",
  "Resolution": "1280x720",
  "Codec": "MPEG-2"
}
```

#### Field

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| key | string |  | Yes |
| type | [Type](#type) |  | Yes |
| locked | boolean |  | No |

#### FieldsRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| oldKey | string |  | No |
| field | [Field](#field) |  | No |

#### Type

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Type | string | must be 'number', 'string', or 'image' |  |
