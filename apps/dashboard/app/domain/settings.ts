import type {
  BookingOnboardingPayload,
  PaymentsOnboardingPayload,
  RentalOnboardingPayload,
} from '~/domain/mitra'

export type SettingsSectionKey = 'business' | 'branding' | 'rental' | 'booking' | 'payments' | 'workspace'
export type EditableSettingsSection = Exclude<SettingsSectionKey, 'workspace'>
export type SettingsImageType = 'logo' | 'favicon' | 'invoice_logo' | 'branch_logo'

export interface TenantRegularSettings {
  business_name: string
  timezone: string
  currency: string
  default_language: string
  date_format?: string
  time_format?: string
}

export interface TenantBrandingSettings {
  primary_color?: string
  secondary_color?: string
  logo_path?: string | null
  logo_url?: string | null
  favicon_path?: string | null
  favicon_url?: string | null
  invoice_logo_path?: string | null
  invoice_logo_url?: string | null
}

export interface TenantBranchSettings {
  id: number
  name: string
  phone?: string | null
  address?: string | null
  is_active?: boolean
  settings?: {
    logo_path?: string | null
    logo_url?: string | null
    [key: string]: unknown
  } | null
}

export interface TenantRentalEngineSettings {
  rental_model: RentalOnboardingPayload['rental_model']
  booking_strategy: RentalOnboardingPayload['booking_strategy']
  allocation_strategy: RentalOnboardingPayload['allocation_strategy']
  slot_duration_minutes?: number | null
  enable_waiting_list?: boolean
}

export interface TenantWebsiteStatus {
  is_enabled: boolean
}

export interface TenantSettings {
  regular: TenantRegularSettings
  branding: TenantBrandingSettings
  branch: TenantBranchSettings
  rental_engine: TenantRentalEngineSettings
  website_status?: TenantWebsiteStatus
}

export interface TenantSettingsUpdatePayload {
  regular?: Partial<TenantRegularSettings>
  branding?: Pick<TenantBrandingSettings, 'primary_color' | 'secondary_color'>
  branch?: {
    name?: string
    phone?: string | null
    address?: string | null
    is_active?: boolean
  }
  rental_engine?: Partial<TenantRentalEngineSettings>
}

export interface SettingsBusinessForm {
  business_name: string
  timezone: string
  currency: string
  default_language: string
  date_format: string
  time_format: string
  branch_name: string
  branch_phone: string
  branch_address: string
  branch_is_active: boolean
}

export interface SettingsBrandingForm {
  primary_color: string
  secondary_color: string
}

export interface SettingsRentalForm {
  rental_model: TenantRentalEngineSettings['rental_model']
  booking_strategy: TenantRentalEngineSettings['booking_strategy']
  allocation_strategy: TenantRentalEngineSettings['allocation_strategy']
  slot_duration_minutes: number | null
  enable_waiting_list: boolean
}
export type SettingsBookingForm = BookingOnboardingPayload

export interface SettingsPaymentForm {
  cashEnabled: boolean
  transferEnabled: boolean
  bankName: string
  accountNumber: string
  accountName: string
}

export interface SettingsForms {
  business: SettingsBusinessForm
  branding: SettingsBrandingForm
  rental: SettingsRentalForm
  booking: SettingsBookingForm
  payments: SettingsPaymentForm
}

export function toPaymentsPayload(form: SettingsPaymentForm): PaymentsOnboardingPayload {
  return {
    methods: [
      {
        method: 'cash',
        is_enabled: form.cashEnabled,
        configuration: null,
      },
      {
        method: 'transfer',
        is_enabled: form.transferEnabled,
        configuration: form.transferEnabled
          ? {
              bank_name: form.bankName.trim(),
              account_number: form.accountNumber.trim(),
              account_name: form.accountName.trim(),
            }
          : null,
      },
    ],
  }
}
