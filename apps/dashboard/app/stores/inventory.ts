import { defineStore } from 'pinia'
import type {
  InventoryCollectionPayload,
  InventoryMeta,
  InventoryStock,
  ProductUnit,
  ProductUnitCreatePayload,
  ProductUnitQuery,
  StockAdjustmentPayload,
} from '~/domain/inventory'
import { useInventoryRepository } from '~/infrastructure/repositories/inventoryRepository'

function normalizeCollection<T>(payload: InventoryCollectionPayload<T>) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      meta: {
        currentPage: 1,
        lastPage: 1,
        perPage: payload.length,
        total: payload.length,
      } satisfies InventoryMeta,
    }
  }

  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    meta: {
      currentPage: payload.current_page || 1,
      lastPage: payload.last_page || 1,
      perPage: payload.per_page || payload.data.length,
      total: payload.total ?? payload.data.length,
    } satisfies InventoryMeta,
  }
}

const emptyMeta = (): InventoryMeta => ({
  currentPage: 1,
  lastPage: 1,
  perPage: 0,
  total: 0,
})

export const useInventoryStore = defineStore('inventory', () => {
  const units = ref<ProductUnit[]>([])
  const stocks = ref<InventoryStock[]>([])
  const unitMeta = ref<InventoryMeta>(emptyMeta())
  const stockMeta = ref<InventoryMeta>(emptyMeta())
  const loadingUnits = ref(false)
  const loadingStocks = ref(false)
  const creatingUnit = ref(false)
  const adjustingStock = ref(false)
  const error = ref('')

  async function fetchUnits(query: ProductUnitQuery = {}) {
    loadingUnits.value = true
    error.value = ''
    try {
      const response = await useInventoryRepository().listUnits(query)
      const normalized = normalizeCollection(response.data)
      units.value = normalized.items
      unitMeta.value = normalized.meta
      return units.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar unit produk gagal dimuat.'
      throw err
    } finally {
      loadingUnits.value = false
    }
  }

  async function fetchStocks() {
    loadingStocks.value = true
    error.value = ''
    try {
      const response = await useInventoryRepository().listStocks()
      const normalized = normalizeCollection(response.data)
      stocks.value = normalized.items
      stockMeta.value = normalized.meta
      return stocks.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Saldo stok produk gagal dimuat.'
      throw err
    } finally {
      loadingStocks.value = false
    }
  }

  async function createUnit(payload: ProductUnitCreatePayload) {
    creatingUnit.value = true
    error.value = ''
    try {
      const response = await useInventoryRepository().createUnit(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unit produk gagal ditambahkan.'
      throw err
    } finally {
      creatingUnit.value = false
    }
  }

  async function adjustStock(payload: StockAdjustmentPayload) {
    adjustingStock.value = true
    error.value = ''
    try {
      const response = await useInventoryRepository().adjustStock(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Penyesuaian stok gagal disimpan.'
      throw err
    } finally {
      adjustingStock.value = false
    }
  }

  function reset() {
    units.value = []
    stocks.value = []
    unitMeta.value = emptyMeta()
    stockMeta.value = emptyMeta()
    error.value = ''
  }

  return {
    units,
    stocks,
    unitMeta,
    stockMeta,
    loadingUnits,
    loadingStocks,
    creatingUnit,
    adjustingStock,
    error,
    fetchUnits,
    fetchStocks,
    createUnit,
    adjustStock,
    reset,
  }
})
