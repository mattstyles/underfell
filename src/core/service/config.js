
var config = new Map()
config.set('no_block', false)

export const get = key => {
  return config.get(key)
}

const setFromStorage = key => {
  let options = {}
  try {
    options = JSON.parse(window.localStorage.getItem(key))
  } catch (err) {
    console.error('Error parsing debug options')
    return
  }

  if (!options) {
    return
  }

  Object.keys(options).forEach(k => {
    let v = options[k]
    config.set(k, v)
  })
}

setFromStorage('DEBUG_OPTIONS')
