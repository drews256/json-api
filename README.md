# JSON API Spec
http://jsonapi.org/

uses the JSON API and stores resources in a Redux Store.

Use:

With JSON API conformant JSON

```js
const json = {
  'data': [{
    'type': 'articles',
    'id': '2',
    'attributes': {
      'title': 'JSON API paints my bikeshed!'
    }
}

const jsonApi = new activeJsonApi('example')
// Updating the Store adds the JSON to the store namespaced utilizing the Resources type
jsonApi.updateStore(json)

// Simple Getters allow you to grab resources

// State of the store
jsonApi.store.getState() =  { 'articles' : [ { object Object } ] }

// Resources by id
jsonApi.getObject('articles', 2) = json

// All Resources by resource type
jsonApi.getAll('articles') = [ { object Object } ]

// It keeps the state consistent no matter how many times you load JSON into the store
jsonApi.updateStore(json)

// It merges objects by ID when you update the store with objects that have the same ID
jsonApi.store.getState() =  { 'articles' : [ { object Object } ] }
jsonApi.getObject('articles', 2) = json
jsonApi.getAll('articles') = [ { object Object } ]
```

## Dependencies
- deep merge
- react
- redux
