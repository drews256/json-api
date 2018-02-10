var assert = chai.assert
import activeJsonApi from '../json-api'
import { array_merge } from '../json-api/reducers'

const canonical_json = {
  'links': {
    'self': 'http://example.com/articles',
    'next': 'http://example.com/articles?page[offset]=2',
    'last': 'http://example.com/articles?page[offset]=10'
  },
  'data': [{
    'type': 'articles',
    'id': '1',
    'attributes': {
      'title': 'JSON API paints my bikeshed!'
    },
    'relationships': {
      'author': {
        'links': {
          'self': 'http://example.com/articles/1/relationships/author',
          'related': 'http://example.com/articles/1/author'
        },
        'data': { 'type': 'people', 'id': '9' }
      },
      'comments': {
        'links': {
          'self': 'http://example.com/articles/1/relationships/comments',
          'related': 'http://example.com/articles/1/comments'
        },
        'data': [
          { 'type': 'comments', 'id': '5' },
          { 'type': 'comments', 'id': '12' }
        ]
      }
    },
    'links': {
      'self': 'http://example.com/articles/1'
    }
  }],
  'included': [{
    'type': 'people',
    'id': '9',
    'attributes': {
      'first-name': 'Dan',
      'last-name': 'Gebhardt',
      'twitter': 'dgeb'
    },
    'links': {
      'self': 'http://example.com/people/9'
    }
  }, {
    'type': 'comments',
    'id': '5',
    'attributes': {
      'body': 'First!'
    },
    'relationships': {
      'author': {
        'data': { 'type': 'people', 'id': '2' }
      }
    },
    'links': {
      'self': 'http://example.com/comments/5'
    }
  }, {
    'type': 'comments',
    'id': '12',
    'attributes': {
      'body': 'I like XML better'
    },
    'relationships': {
      'author': {
        'data': { 'type': 'people', 'id': '9' }
      }
    },
    'links': {
      'self': 'http://example.com/comments/12'
    }
  }]
}

const update_article_json = {
  'links': {
    'self': 'http://example.com/articles',
    'next': 'http://example.com/articles?page[offset]=2',
    'last': 'http://example.com/articles?page[offset]=10'
  },
  'data': [{
    'type': 'articles',
    'id': '1',
    'attributes': {
      'title': 'JSON API paints my bikeshed!'
    },
    'relationships': {
      'author': {
        'links': {
          'self': 'http://example.com/articles/1/relationships/author',
          'related': 'http://example.com/articles/1/author'
        },
        'data': { 'type': 'people', 'id': '9' }
      },
      'comments': {
        'links': {
          'self': 'http://example.com/articles/1/relationships/comments',
          'related': 'http://example.com/articles/1/comments'
        },
        'data': [
          { 'type': 'comments', 'id': '5' },
          { 'type': 'comments', 'id': '12' }
        ]
      }
    },
    'links': {
      'self': 'http://example.com/articles/1'
    }
  }]
}

const new_article_json = {
  'links': {
    'self': 'http://example.com/articles',
    'next': 'http://example.com/articles?page[offset]=2',
    'last': 'http://example.com/articles?page[offset]=10'
  },
  'data': [{
    'type': 'articles',
    'id': '2',
    'attributes': {
      'title': 'JSON API paints my bikeshed!'
    },
    'relationships': {
      'author': {
        'links': {
          'self': 'http://example.com/articles/1/relationships/author',
          'related': 'http://example.com/articles/1/author'
        },
        'data': { 'type': 'people', 'id': '9' }
      },
      'comments': {
        'links': {
          'self': 'http://example.com/articles/1/relationships/comments',
          'related': 'http://example.com/articles/1/comments'
        },
        'data': [
          { 'type': 'comments', 'id': '5' },
          { 'type': 'comments', 'id': '12' }
        ]
      }
    },
    'links': {
      'self': 'http://example.com/articles/1'
    }
  }]
}

describe('activeJsonApi', function () {
  it('should create a meta store', function () {
    const jsonApi = new activeJsonApi('test')
    assert.deepEqual({ resource_types: [], included_resource_types: [] }, jsonApi.meta_store.getState())
  })

  it('should create a store', function () {
    const jsonApi = new activeJsonApi('test')
    assert.deepEqual({ }, jsonApi.store.getState())
  })

  it('should have a class name', function () {
    const jsonApi = new activeJsonApi('test')
    assert.deepEqual('test', jsonApi.class_name)
  })

  describe('with the canonical json', function () {
    it('should have a resource type', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      assert.deepEqual(['articles'], jsonApi.meta_store.getState()['resource_types'])
    })

    it('should store the canonical json', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      assert.deepEqual(canonical_json, jsonApi.meta_store.getState()['canonical_json'])
    })

    it('should add the included resource types', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      jsonApi.parseIncludedResourceObjects()
      assert.deepEqual(['people', 'comments'], jsonApi.meta_store.getState()['included_resource_types'])
    })

    it('returns all resource types as an array', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      jsonApi.parseIncludedResourceObjects()
      expect(jsonApi.buildStoreKeys()).to.have.all.members(['articles', 'people', 'comments'])
    })

    it('adds all the resource types as keys to the store', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      jsonApi.parseIncludedResourceObjects()
      jsonApi.addTopLevelKeysToStore()
      expect(jsonApi.store.getState()['articles']).to.be.an('array')
      expect(jsonApi.store.getState()['comments']).to.be.an('array')
      expect(jsonApi.store.getState()['people']).to.be.an('array')
    })

    it('updates the store with the resource object', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      jsonApi.parseIncludedResourceObjects()
      jsonApi.addTopLevelKeysToStore()
      jsonApi.updateStoreWithResourceObjects()
      assert.deepEqual([canonical_json['data'][0]], jsonApi.store.getState()['articles'])
    })

    it('updates the store with the included resource object', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      assert.deepEqual(canonical_json['included'][1], jsonApi.store.getState()['comments'][0])
    })
  })

  describe('accessing values from the store should be possible', function () {
    it('accesses by type and id', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      assert.deepEqual(jsonApi.getObject('articles', 1), canonical_json['data'][0])
    })

    it('returns all possible values of a given type', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      assert.deepEqual(jsonApi.getAll('articles'), [canonical_json['data'][0]])
    })
  })

  describe('it doesnt duplicate existing objects', function () {
    it('safely updates the stores with no new objects', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      jsonApi.updateStore(canonical_json)
      jsonApi.updateStore(canonical_json)
      jsonApi.updateStore(canonical_json)
      assert.deepEqual(jsonApi.getAll('articles'), [canonical_json['data'][0]])
    })

    it('safely adds objects', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      jsonApi.updateStore(new_article_json)
      expect(jsonApi.getAll('articles')).to.eql([canonical_json['data'][0], new_article_json['data'][0]])
    })

    it('safely updates objects', function () {
      const jsonApi = new activeJsonApi('test')
      jsonApi.updateStore(canonical_json)
      jsonApi.updateStore(update_article_json)
      expect(jsonApi.getAll('articles')[0]).to.eql(canonical_json['data'][0])
    })
  })
})

describe('array_merge', function () {
  it('merges arrays of objects deeply', function () {
    let source_array = [{ type: 'foo', id: 3 }, { type: 'foo', id: 5 }]
    let destination_array = [{ type: 'foo', id: 3 }, { type: 'foo', id: 5 }]
    expect(array_merge(destination_array, source_array)).to.eql(source_array)
  })

  it('appends new objects in destination_array to the source_array', function () {
    let source_array = [{ type: 'foo', id: 3 }, { type: 'foo', id: 5 }]
    let destination_array = [{ type: 'foo', id: 3 }]
    expect(array_merge(destination_array, source_array)).to.eql(source_array)
  })

  it('appends new objects in source_array to the destination_array', function () {
    let source_array = [{ type: 'foo', id: 3 }, { type: 'foo', id: 5 }]
    let destination_array = [{ type: 'foo', id: 3 }]
    expect(array_merge(source_array, destination_array)).to.eql(source_array)
  })
})
