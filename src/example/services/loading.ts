import { ref, readonly } from 'vue'

const loading = ref(false)

const setLoading = (newValue: boolean) => loading.value = newValue

export const useLoading = () => {
  return {
    loading,
    methodsLoading: readonly({
      setLoading
    })
  }
}
