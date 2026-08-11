import { defineStore } from 'pinia'
import type {
  Customer,
  CustomerCollectionPayload,
  CustomerCreatePayload,
  CustomerDocumentUploadPayload,
  CustomerUpdatePayload,
} from '~/domain/customer'
import { useCustomerRepository } from '~/infrastructure/repositories/customerRepository'

function normalizeCollection(payload: CustomerCollectionPayload) {
  if (Array.isArray(payload)) return { items: payload, total: payload.length }
  return {
    items: Array.isArray(payload.data) ? payload.data : [],
    total: payload.total ?? payload.data.length,
  }
}

export const useCustomerStore = defineStore('customers', () => {
  const items = ref<Customer[]>([])
  const detail = ref<Customer | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const loadingDetail = ref(false)
  const creating = ref(false)
  const updating = ref(false)
  const uploadingDocument = ref(false)
  const verifyingDocument = ref<number | null>(null)
  const deletingDocument = ref<number | null>(null)
  const error = ref('')

  async function fetchAll() {
    loading.value = true
    error.value = ''
    try {
      const response = await useCustomerRepository().list()
      const normalized = normalizeCollection(response.data)
      items.value = normalized.items
      total.value = normalized.total
      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Daftar pelanggan gagal dimuat.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CustomerCreatePayload) {
    creating.value = true
    error.value = ''
    try {
      const response = await useCustomerRepository().create(payload)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pelanggan gagal ditambahkan.'
      throw err
    } finally {
      creating.value = false
    }
  }

  async function fetchDetail(id: number) {
    loadingDetail.value = true
    error.value = ''
    try {
      const response = await useCustomerRepository().get(id)
      detail.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Detail pelanggan gagal dimuat.'
      throw err
    } finally {
      loadingDetail.value = false
    }
  }

  async function update(id: number, payload: CustomerUpdatePayload) {
    updating.value = true
    error.value = ''
    try {
      const response = await useCustomerRepository().update(id, payload)
      if (detail.value?.id === id) detail.value = response.data
      const index = items.value.findIndex((customer) => customer.id === id)
      if (index >= 0) items.value[index] = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Pelanggan gagal diperbarui.'
      throw err
    } finally {
      updating.value = false
    }
  }

  async function uploadDocument(customerId: number, payload: CustomerDocumentUploadPayload) {
    uploadingDocument.value = true
    error.value = ''
    try {
      const response = await useCustomerRepository().uploadDocument(customerId, payload)
      if (detail.value?.id === customerId) {
        detail.value.documents = [...(detail.value.documents || []), response.data]
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Dokumen identitas gagal diunggah.'
      throw err
    } finally {
      uploadingDocument.value = false
    }
  }

  async function verifyDocument(customerId: number, documentId: number) {
    verifyingDocument.value = documentId
    error.value = ''
    try {
      const response = await useCustomerRepository().verifyDocument(customerId, documentId)
      if (detail.value?.id === customerId) {
        detail.value.documents = (detail.value.documents || []).map((document) =>
          document.id === documentId ? response.data : document,
        )
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Dokumen gagal diverifikasi.'
      throw err
    } finally {
      verifyingDocument.value = null
    }
  }

  async function deleteDocument(customerId: number, documentId: number) {
    deletingDocument.value = documentId
    error.value = ''
    try {
      await useCustomerRepository().deleteDocument(customerId, documentId)
      if (detail.value?.id === customerId) {
        detail.value.documents = (detail.value.documents || []).filter(
          (document) => document.id !== documentId,
        )
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Dokumen gagal dihapus.'
      throw err
    } finally {
      deletingDocument.value = null
    }
  }

  function reset() {
    items.value = []
    detail.value = null
    total.value = 0
    error.value = ''
  }

  return {
    items,
    detail,
    total,
    loading,
    loadingDetail,
    creating,
    updating,
    uploadingDocument,
    verifyingDocument,
    deletingDocument,
    error,
    fetchAll,
    fetchDetail,
    create,
    update,
    uploadDocument,
    verifyDocument,
    deleteDocument,
    reset,
  }
})
