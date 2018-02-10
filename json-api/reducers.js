import merge from 'deepmerge'
import isMergeableObject from 'is-mergeable-object'

export function jsonApiReducers (state = {}, action) {
  switch (action.type) {
    case 'PARSE_JSON_API':
      return state
    case 'ADD_EMPTY_KEY':
      state[action.key] = state[action.key] || []
      return state
    case 'UPDATE_OR_CREATE_OBJECT':
      const resources = state[action.resource_type]
      const id = action.object['id']
      let new_resources = merge_object(resources, action.object)
      state[action.resource_type] = new_resources
      return state
    default:
      return state
  }
}

export function array_merge (destinationArray, sourceArray, options) {
  let array = sourceArray
  destinationArray.forEach(object => {
    array = merge_object(array, object)
  })
  return array
}

function merge_object (resources, new_object) {
  const id = new_object['id']
  let old_object = filter_by_id(resources, id) || {}
  let deeply_merged_object = merge(old_object, new_object, { arrayMerge: array_merge })
  let old_object_index = find_by_id(resources, id)
  if (old_object_index == -1) {
    resources.push(deeply_merged_object)
  } else {
    resources.splice(old_object_index, 1)
    resources.push(deeply_merged_object)
  }
  return resources
}

function find_by_id (resources, id) {
  return resources.findIndex(resource => {
    return resource['id'] == id
  })
}

function filter_by_id (resources, id) {
  return resources.filter(resource => {
    return resource['id'] == id
  })[0]
}

export function metaReducers (state = {}, action) {
  switch (action.type) {
    case 'ADD_RESOURCE_TYPES':
      state.resource_types = [...state.resource_types, action.resource_type]
      return state
    case 'ADD_INCLUDED_RESOURCE_TYPES':
      let new_included_resource_types = [...state.included_resource_types, action.resource_type]
      state.included_resource_types = [...new Set(new_included_resource_types)]
      return state
    case 'ADD_CANONICAL_JSON':
      state.canonical_json = action.json
      return state
    default:
      return state
  }
}
