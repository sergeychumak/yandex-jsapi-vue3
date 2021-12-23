import { readonly, ref } from 'vue'
import axios from 'axios'
import { useLoading } from './loading'
import { Ref, YandexMapResponse } from './../types'
import { urlGeocode, keyYandexApi } from './_const'

const { methodsLoading } = useLoading()

const ymResponse: Ref<YandexMapResponse> = ref({
  featureMember: [],
  metaDataProperty: {}
})

const geocode = (searchString: string): void => {
  methodsLoading.setLoading(true)
  axios
    .get(`${urlGeocode}`, {
      params: {
        apikey: keyYandexApi,
        geocode: searchString,
        format: 'json'
      }
    })
    .then((res) => {
      const { data: { response: { GeoObjectCollection } } } = res
      ymResponse.value = {
        featureMember: GeoObjectCollection.featureMember,
        metaDataProperty: GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData
      }
      methodsLoading.setLoading(false)
    })
}

export const useGeocode = () => {
  return {
    ymResponse,
    methodsYandexMap: readonly({
      geocode
    })
  }
}
