import { isDate, isObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any) {
  if (!params) {
    return url
  }

  //
  let parts = Object.keys(params)
    .filter(key => !(params[key] === null || typeof params[key] === 'undefined'))
    .map(handleParams)
  function handleParams(key: string) {
    let val = params[key]
    if (Array.isArray(val)) {
      return val.map(stringifyValue).map(val => `${encode(key)}=${encode(val)}`)
    }
    return `${encode(key)}=${encode(val)}`
  }
  let serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
function stringifyValue(val: any) {
  if (isDate(val)) {
    return val.toISOString()
  } else if (isObject(val)) {
    return JSON.stringify(val)
  }
  return val
}
