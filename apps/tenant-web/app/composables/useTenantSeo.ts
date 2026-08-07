import { computed } from 'vue'
import type { Ref } from 'vue'
import { useHead, useSeoMeta } from '#app/composables/head'
import { useRoute } from '#app/composables/router'
import { useRequestURL } from '#app/composables/url'
import type { Tenant } from '~~/shared/types'

export function useTenantSeo(tenant: Ref<Tenant>) {
  const route = useRoute()
  const requestUrl = useRequestURL()

  const title = computed(() => tenant.value.seo.title || tenant.value.businessName)
  const description = computed(() => tenant.value.seo.description || tenant.value.description || '')
  const canonical = computed(() => {
    try {
      return new URL(route.path, tenant.value.seo.canonicalUrl || requestUrl.origin).toString()
    }
    catch {
      return new URL(route.path, requestUrl.origin).toString()
    }
  })
  const language = computed(() => tenant.value.locale?.split(/[-_]/)[0] || 'id')

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: computed(() => tenant.value.seo.ogImage || undefined),
    ogSiteName: computed(() => tenant.value.businessName),
    ogType: 'website',
    ogUrl: canonical,
    twitterCard: computed(() => tenant.value.seo.ogImage ? 'summary_large_image' : 'summary'),
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: computed(() => tenant.value.seo.ogImage || undefined),
  })

  useHead(() => ({
    htmlAttrs: {
      lang: language.value,
    },
    link: [
      { rel: 'canonical', href: canonical.value },
      ...(tenant.value.theme.favicon
        ? [{ rel: 'icon' as const, href: tenant.value.theme.favicon }]
        : []),
    ],
  }))
}
