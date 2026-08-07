import { defineStore } from 'pinia'
import type {
  CategoryListQuery,
  CategoryPayload,
  CollectionMeta,
  CollectionPayload,
  Product,
  ProductCategory,
  ProductImagePayload,
  ProductListQuery,
  ProductPayload,
} from '~/domain/product'
import { useProductRepository } from '~/infrastructure/repositories/productRepository'

function normalizeCollection<T>(payload: CollectionPayload<T>) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      meta: {
        currentPage: 1,
        lastPage: 1,
        perPage: payload.length,
        total: payload.length,
      } satisfies CollectionMeta,
    }
  }

  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    meta: {
      currentPage: payload.current_page || 1,
      lastPage: payload.last_page || 1,
      perPage: payload.per_page || payload.data.length,
      total: payload.total ?? payload.data.length,
    } satisfies CollectionMeta,
  }
}

const emptyMeta = (): CollectionMeta => ({
  currentPage: 1,
  lastPage: 1,
  perPage: 0,
  total: 0,
})

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<ProductCategory[]>([])
  const productMeta = ref<CollectionMeta>(emptyMeta())
  const categoryMeta = ref<CollectionMeta>(emptyMeta())
  const loadingProducts = ref(false)
  const loadingCategories = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const savingImage = ref(false)
  const error = ref('')

  async function fetchProducts(query: ProductListQuery = {}) {
    loadingProducts.value = true
    error.value = ''

    try {
      const response = await useProductRepository().listProducts(query)
      const normalized = normalizeCollection(response.data)
      products.value = normalized.items
      productMeta.value = normalized.meta
      return products.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar produk gagal dimuat.'
      throw err
    } finally {
      loadingProducts.value = false
    }
  }

  async function fetchCategories(query: CategoryListQuery = {}) {
    loadingCategories.value = true
    error.value = ''

    try {
      const response = await useProductRepository().listCategories(query)
      const normalized = normalizeCollection(response.data)
      categories.value = normalized.items
      categoryMeta.value = normalized.meta
      return categories.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar kategori gagal dimuat.'
      throw err
    } finally {
      loadingCategories.value = false
    }
  }

  async function saveProduct(payload: ProductPayload, id?: number) {
    saving.value = true
    error.value = ''

    try {
      const response = id
        ? await useProductRepository().updateProduct(id, payload)
        : await useProductRepository().createProduct(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Produk gagal disimpan.'
      throw err
    } finally {
      saving.value = false
    }
  }

  async function saveCategory(payload: CategoryPayload, id?: number) {
    saving.value = true
    error.value = ''

    try {
      const response = id
        ? await useProductRepository().updateCategory(id, payload)
        : await useProductRepository().createCategory(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Kategori gagal disimpan.'
      throw err
    } finally {
      saving.value = false
    }
  }

  async function fetchProduct(id: number) {
    error.value = ''
    try {
      const response = await useProductRepository().getProduct(id)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Detail produk gagal dimuat.'
      throw err
    }
  }

  async function uploadProductImage(id: number, file: File, payload: ProductImagePayload) {
    savingImage.value = true
    error.value = ''
    try {
      const response = await useProductRepository().uploadProductImage(id, file, payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gambar produk gagal diunggah.'
      throw err
    } finally {
      savingImage.value = false
    }
  }

  async function updateProductImage(id: number, imageId: number, payload: ProductImagePayload) {
    savingImage.value = true
    error.value = ''
    try {
      const response = await useProductRepository().updateProductImage(id, imageId, payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Informasi gambar produk gagal diperbarui.'
      throw err
    } finally {
      savingImage.value = false
    }
  }

  async function deleteProductImage(id: number, imageId: number) {
    savingImage.value = true
    error.value = ''
    try {
      await useProductRepository().deleteProductImage(id, imageId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gambar produk gagal dihapus.'
      throw err
    } finally {
      savingImage.value = false
    }
  }

  async function uploadCategoryImage(id: number, file: File) {
    savingImage.value = true
    error.value = ''
    try {
      const response = await useProductRepository().uploadCategoryImage(id, file)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gambar kategori gagal diunggah.'
      throw err
    } finally {
      savingImage.value = false
    }
  }

  async function deleteCategoryImage(id: number) {
    savingImage.value = true
    error.value = ''
    try {
      await useProductRepository().deleteCategoryImage(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Gambar kategori gagal dihapus.'
      throw err
    } finally {
      savingImage.value = false
    }
  }

  async function deleteProduct(id: number) {
    deleting.value = true
    error.value = ''
    try {
      await useProductRepository().deleteProduct(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Produk gagal dihapus.'
      throw err
    } finally {
      deleting.value = false
    }
  }

  async function deleteCategory(id: number) {
    deleting.value = true
    error.value = ''
    try {
      await useProductRepository().deleteCategory(id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Kategori gagal dihapus.'
      throw err
    } finally {
      deleting.value = false
    }
  }

  function reset() {
    products.value = []
    categories.value = []
    productMeta.value = emptyMeta()
    categoryMeta.value = emptyMeta()
    savingImage.value = false
    error.value = ''
  }

  return {
    products,
    categories,
    productMeta,
    categoryMeta,
    loadingProducts,
    loadingCategories,
    saving,
    savingImage,
    deleting,
    error,
    fetchProducts,
    fetchCategories,
    saveProduct,
    saveCategory,
    fetchProduct,
    uploadProductImage,
    updateProductImage,
    deleteProductImage,
    uploadCategoryImage,
    deleteCategoryImage,
    deleteProduct,
    deleteCategory,
    reset,
  }
})
