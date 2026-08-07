export interface ApiErrorPayload {
  code: string
  message: string
  details?: unknown
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  meta?: unknown
  error?: ApiErrorPayload
}

export class ApiRequestError extends Error {
  code: string
  status: number
  details?: unknown

  constructor(message: string, status: number, code = 'REQUEST_FAILED', details?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    this.details = details
  }
}
