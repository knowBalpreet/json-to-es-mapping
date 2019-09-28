const mapper = o => {
  if (o.constructor === Object) {
    Object.keys(o).forEach(k => {
      if (o[k] !== null) {
        if (o[k].constructor === String && o[k] && !isNaN(+o[k])) {
          o[k] = +o[k]
        }
        if (
          o[k] !== null &&
          o[k].constructor === Object &&
          k !== 'properties'
        ) {
          const properties = mapper(o[k])

          o[k] = {
            type: 'object',
          }
          if (Object.keys(properties).length > 0) {
            o[k].properties = properties
          }
        } else if (o[k].constructor === Array) {
          if (o[k].every(elem => elem.constructor === Object)) {
            const keys = o[k].reduce(function(acc, x) {
              for (const key in x) acc[key] = x[key]
              return acc
            }, {})

            const properties = mapper(keys)
            o[k] = {
              type: 'nested',
            }
            if (Object.keys(properties).length > 0) {
              o[k].properties = properties
            }
          } else {
            o[k] = { type: 'keyword' }
          }
        } else if (o[k].constructor === Boolean) {
          o[k] = { type: 'boolean' }
        } else if (o[k].constructor === String && Date.parse(o[k])) {
          o[k] = { type: 'date' }
        } else if (o[k].constructor === Number) {
          if (o[k] % 1 === 0) {
            o[k] = { type: 'long' }
          } else {
            o[k] = { type: 'float' }
          }
        } else {
          o[k] = { type: 'keyword' }
        }
      } else {
        o[k] = { type: 'keyword' }
      }
    })
  }
  return o
}

export { mapper }
