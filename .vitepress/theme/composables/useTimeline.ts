import { ref, computed } from 'vue'
import { benchmarks, categories, statuses, type Category, type Status } from '../../../data/benchmarks'

export function useTimeline() {
  const selectedYear = ref<string>('全部')
  const selectedCategory = ref<Category | '全部'>('全部')
  const selectedStatus = ref<Status | '全部'>('全部')

  const years = computed(() => {
    const yearSet = new Set(benchmarks.map(b => b.date.slice(0, 4)))
    return ['全部', ...Array.from(yearSet).sort()]
  })

  const categoryOptions = computed(() => ['全部', ...categories])
  const statusOptions = computed(() => ['全部', ...statuses])

  const filtered = computed(() => {
    return benchmarks
      .filter(b => {
        if (selectedYear.value !== '全部' && !b.date.startsWith(selectedYear.value)) return false
        if (selectedCategory.value !== '全部' && b.category !== selectedCategory.value) return false
        if (selectedStatus.value !== '全部' && b.status !== selectedStatus.value) return false
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  })

  const count = computed(() => filtered.value.length)

  function reset() {
    selectedYear.value = '全部'
    selectedCategory.value = '全部'
    selectedStatus.value = '全部'
  }

  return {
    selectedYear,
    selectedCategory,
    selectedStatus,
    years,
    categoryOptions,
    statusOptions,
    filtered,
    count,
    reset,
  }
}
