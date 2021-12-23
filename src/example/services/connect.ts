import { readonly } from 'vue'
import { urlYandexApi } from './_const'

const connectionJSAPI = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const elementScript =  document.createElement("script") || null
    if (elementScript) {
      elementScript.setAttribute('src', urlYandexApi)
      elementScript.setAttribute('data-ymaps', '1')
      document.head.appendChild(elementScript)
      elementScript.onload = () => {
        ymaps.ready(() => {
          resolve(true)
        })
      }
    }
  })
}

export const useConnect = () => {
  return {
    methodsConnect: readonly({
      connectionJSAPI
    })
  }
}
