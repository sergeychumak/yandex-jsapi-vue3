import { ref, readonly } from 'vue'
import { Ref } from './../types'

const suggestList: Ref<string[]> = ref([])

const suggest = (str: string): void => {
  setSuggestList([])
  ymaps
    .suggest(str)
    .then(function (items: any) {
      const res: string[] = []
      items.forEach((element: any) => {
        res.push(element.displayName as string)
      })
      setSuggestList(res)
    })
}

const setSuggestList = (newValue: string[]) => suggestList.value = newValue

export const useSuggest = () => {
  return {
    suggestList,
    methodsSuggest: readonly({
      suggest,
      setSuggestList
    })
  }
}
