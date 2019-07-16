import { isDate, isObject } from './util'
import { curry, pipe } from 'ramda'
type searchStringPart = { searchKey: string; searchValue: any }
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
  function retainExistingParams(parts: any[], url: string) {
    return (url += url.indexOf('?') === -1 ? (parts[0] && '?') || '' : '&')
  }
  const parts = transformObjToArray(params)
    .filter(ignoreNullOrUndefined)
    .map(prefixKeyToValue)

  const newUrl = pipe(
    discardHashInURL,
    curry(retainExistingParams)(parts)
  )(url)
  return newUrl + serializedParams(parts)
}

function ignoreNullOrUndefined({ searchValue }: searchStringPart) {
  return searchValue !== null && typeof searchValue !== 'undefined'
}
function stringifyValue(val: any) {
  if (isDate(val)) {
    return val.toISOString()
  } else if (isObject(val)) {
    return JSON.stringify(val)
  }
  return val
}
function transformObjToArray(obj: { [index: string]: any }) {
  return Object.keys(obj).map(searchKey => {
    return {
      searchKey,
      searchValue: obj[searchKey]
    }
  })
}
function prefixKeyToValue({ searchKey, searchValue }: searchStringPart) {
  const finalSearchKey = Array.isArray(searchValue) ? `${searchKey}[]` : searchKey
  const finalSearchValue = (Array.isArray(searchValue) ? searchValue : [searchValue])
    .map(stringifyValue)
    .map(stringifiedValue => composeKeyAndValue(finalSearchKey, stringifiedValue))
  return serializedParams(finalSearchValue)
}

function composeKeyAndValue(key: string, value: string) {
  return `${encode(key)}=${encode(value)}`
}
function serializedParams(parts: any) {
  return parts.join('&')
}
function discardHashInURL(url: string) {
  const markIndex = url.indexOf('#')
  return markIndex !== -1 ? url.slice(0, markIndex) : url
}
