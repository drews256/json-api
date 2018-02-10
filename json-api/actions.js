export function storeCanonicalJson (json, meta_store) {
  meta_store.dispatch({
    type: 'ADD_CANONICAL_JSON',
    json: json
  })
}

export function updateOrCreateStoreWithObject (object, store) {
  store.dispatch({
    type: 'UPDATE_OR_CREATE_OBJECT',
    resource_type: object['type'],
    object: object
  })
}

export function dispatchPushResourceTypes (type, meta_store) {
  meta_store.dispatch(
    {
      type: 'ADD_RESOURCE_TYPES',
      resource_type: type
    }
  )
}

export function dispatchIncludedResourceTypes (type, meta_store) {
  meta_store.dispatch(
    {
      type: 'ADD_INCLUDED_RESOURCE_TYPES',
      resource_type: type
    }
  )
}

export function dispatchAddEmptyKey (key, store) {
  store.dispatch({
    type: 'ADD_EMPTY_KEY',
    key: key
  })
}
