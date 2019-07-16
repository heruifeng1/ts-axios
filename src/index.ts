import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
function axios(config: AxiosRequestConfig): void {
  const newConfig = processConfig(config)
  xhr(newConfig)
}

function processConfig(config: AxiosRequestConfig) {
  return {
    ...config,
    url: buildURL(config.url, config.params)
  }
}
export default axios
