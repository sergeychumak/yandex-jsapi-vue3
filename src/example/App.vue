<template>
  <div class="app">
    <h1>Test suggest</h1>
    <input
      class="input"
      type="text"
      placeholder="Введите адрес"
      v-model="searchStringComputed"
    />
    <ul class="menu-list">
      <li
        v-for="item in suggestList"
        :key="item"
        @click="setSearchString(item, true)"
      >
        <a>{{ item }}</a>
      </li>
    </ul>
    <hr/>
    <div class="columns">
      <div class="column">
        <button
          class="button block"
          :class="{'is-loading': loading}"
          @click="runGeocode"
        >
          Поиск
        </button>
        <template v-if="isMetaDataProperty">
          <div class="block">Итог:</div>
          <ul class="block">
            <li>ищем: {{ ymResponse.metaDataProperty.request }}</li>
            <li>результат: {{ ymResponse.metaDataProperty.results }}</li>
            <li>fix: {{ ymResponse.metaDataProperty.suggest }}</li>
            <li>found: {{ ymResponse.metaDataProperty.found }}</li>
          </ul>
        </template>
      </div>
      <div class="column">
        <template v-if="isFeatureMember">
          <div class="card block" v-for="element in ymResponse.featureMember" :key="element">
            <div class="card-content">
              point revert:
              {{ element.GeoObject.Point.pos.split(' ').reverse().join(' ') }}
              <div class="content">
                <VueJsonPretty :data="element"/>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import { useLoading } from './services/loading'
import { useConnect } from './services/connect'
import { useSuggest } from './services/suggest'
import { useGeocode } from './services/geocode'

const { loading } = useLoading()
const { methodsConnect } = useConnect()
const { suggestList, methodsSuggest } = useSuggest()
const { ymResponse, methodsYandexMap } = useGeocode()

const init = async () => {
  await methodsConnect
    .connectionJSAPI()
    .then((res: boolean) => {
      if (res) {
        console.log('JS API connect')
      }
    })
}

const searchString = ref('')

const searchStringComputed = computed({
  get: () => searchString.value,
  set: (newValue: string) => {
    searchString.value = newValue
    methodsSuggest.suggest(newValue)
  }
})

export default defineComponent({
  name: 'app',
  components: {
    VueJsonPretty,
  },
  setup () {
    init()

    return {
      loading,
      searchStringComputed,
      suggestList,
      ymResponse,
      setSearchString: (newValue: string, clearSuggestList: boolean) => {
        searchString.value = newValue
        clearSuggestList && methodsSuggest.setSuggestList([])
      },
      runGeocode: () => methodsYandexMap.geocode(searchStringComputed.value),
      isMetaDataProperty: computed(() => Object.keys(ymResponse.value.metaDataProperty).length > 0),
      isFeatureMember: computed(() => ymResponse.value.featureMember.length > 0)
    }
  }
})
</script>

<style lang="scss">
  .app {
    width: 90%;
    margin: auto;
    padding-top: 40px
  }
</style>
