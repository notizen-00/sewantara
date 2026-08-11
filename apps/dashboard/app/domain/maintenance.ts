export type MaintenanceType = 'service' | 'repair' | 'cleaning' | 'inspection' | 'calibration'
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type MaintenanceUnitStatus = 'available' | 'damaged' | 'inactive'

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  service: 'Servis',
  repair: 'Perbaikan',
  cleaning: 'Pembersihan',
  inspection: 'Inspeksi',
  calibration: 'Kalibrasi',
}

export const MAINTENANCE_TYPE_OPTIONS = (Object.keys(MAINTENANCE_TYPE_LABELS) as MaintenanceType[])
  .map((value) => ({ label: MAINTENANCE_TYPE_LABELS[value], value }))

export const MAINTENANCE_UNIT_STATUS_LABELS: Record<MaintenanceUnitStatus, string> = {
  available: 'Tersedia',
  damaged: 'Rusak',
  inactive: 'Nonaktif',
}

export const MAINTENANCE_UNIT_STATUS_OPTIONS = (Object.keys(MAINTENANCE_UNIT_STATUS_LABELS) as MaintenanceUnitStatus[])
  .map((value) => ({ label: MAINTENANCE_UNIT_STATUS_LABELS[value], value }))

export interface MaintenanceRecord {
  id: number
  product_unit_id: number
  type: MaintenanceType
  title: string
  description?: string | null
  vendor?: string | null
  cost?: number | string | null
  scheduled_at?: string | null
  started_at?: string | null
  completed_at?: string | null
  status: MaintenanceStatus
  created_by?: number | null
  product_unit?: {
    id: number
    unit_code: string
    status?: string
    condition?: string
    product?: { id: number; name: string; sku?: string } | null
  } | null
  created_at?: string
  [key: string]: unknown
}

export interface MaintenanceCreatePayload {
  product_unit_id: number
  type: MaintenanceType
  title: string
  description: string | null
  vendor: string | null
  cost: number | null
  scheduled_at: string | null
}

export interface MaintenanceCompletePayload {
  unit_status?: MaintenanceUnitStatus
  condition?: string | null
  current_meter?: number | null
  cost?: number | null
  description?: string | null
}

export interface MaintenanceCollection<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export type MaintenanceCollectionPayload<T> = T[] | MaintenanceCollection<T>
