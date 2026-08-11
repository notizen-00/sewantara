<?php

app('router')->setCompiledRoutes(
    array (
  'compiled' => 
  array (
    0 => true,
    1 => 
    array (
      '/' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::KCI2P1JSgJy8zcCw',
          ),
          1 => 'localhost',
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'generated::O9XUJqPiZvkIvC7w',
          ),
          1 => 'api.sewantara.test',
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'generated::813bdftL4xbWzsJT',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/sanctum/csrf-cookie' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'sanctum.csrf-cookie',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/shared/health' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'shared.health',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/business-templates' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.business-templates.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/plans' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.plans.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/billing/doku/webhook' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.billing.doku.webhook',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/billing/midtrans/webhook' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.billing.midtrans.webhook',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/billing/xendit/webhook' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.billing.xendit.webhook',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/auth/register' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.auth.register',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/auth/otp/request' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.auth.otp.request',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/auth/otp/verify' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.auth.otp.verify',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/auth/google/redirect' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.auth.google.redirect',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/auth/google/callback' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.auth.google.callback',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/auth/google/exchange' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.auth.google.exchange',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/central/tenants' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.tenants.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'central.tenants.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/tenant/auth/login' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.auth.login',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/up' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::dDiMpRxHzWPjNbcf',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/healthz' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.health',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/readyz' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'internal.readiness',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/tenant' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.tenant',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/home' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.home',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/categories' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.categories.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/catalog' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.catalog.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/bookings/quote' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.bookings.quote',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/bookings' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.bookings.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/blog' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.blog.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/v1/public/sitemap' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.sitemap',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/broadcasting/auth' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::d0WxWO7qfgnTsxan',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'POST' => 1,
            'HEAD' => 2,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
    ),
    2 => 
    array (
      0 => '{^(?|(?:(?:[^./]*+\\.)++)(?|/tenancy/assets(?:/((?:.*)))?(*:58)|/api/(?|central/tenants/([^/]++)(*:97)|tenant/([^/]++)/(?|m(?|e(?|dia/(.*)(*:139)|(*:147)|mberships(?|(*:167)|/([^/]++)(?|(*:187))))|aintenance(?|(*:211)|/([^/]++)(?|(*:231)|/(?|start(*:248)|c(?|omplete(*:267)|ancel(*:280))))))|p(?|ayments/webhooks/([^/]++)(*:322)|roduct(?|s(?|/([^/]++)(?|/images(?|(*:365)|/([^/]++)(?|(*:385)))|(*:395))|(*:404))|\\-(?|units(?|/([^/]++)/transfer(*:444)|(*:452))|prices(?|(*:470)|/([^/]++)(?|(*:490)))))|ublic\\-articles(?|/([^/]++)(?|/cover(*:538)|(*:546))|(*:555)))|a(?|uth/logout(*:579)|vailability/check(*:604))|s(?|ubscription/payments/(?|checkout(*:649)|([\\da-fA-F]{8}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{12})(*:729))|ettings(?|(*:748)|/(?|images(?|(*:769)|/([^/]++)(*:786))|website\\-status(*:810)))|ales\\-orders(?|(*:835)|/([^/]++)(?|(*:855))))|onboarding(?|(*:879)|/(?|b(?|usiness(*:902)|ooking(*:916))|rental(*:931)|inventory/complete(*:957)|p(?|ricing/complete(*:984)|ayments(*:999))|go\\-live(*:1016)))|engines(?|(*:1037)|/(?|enable(*:1056)|disable(*:1072)))|b(?|ranches(?|(*:1097)|/([^/]++)(?|(*:1118)|/sync\\-master\\-data(*:1146)))|ookings(?|(*:1167)|/([^/]++)(?|(*:1188)|/(?|c(?|heck\\-out(*:1214)|ancel(*:1228))|return(*:1244)|payments(?|(*:1264)|/checkout(*:1282))))))|c(?|ategories(?|/([^/]++)(?|/image(?|(*:1333))|(*:1343))|(*:1353))|ustomers(?|(*:1374)|/([^/]++)(?|(*:1395))))|inventory/(?|stocks(?|(*:1429)|/(?|adjust(*:1448)|transfer(*:1465)))|movements/(?|stocks(*:1495)|units(*:1509)))|reports/dashboard(*:1537)))|/v1/public/(?|catalog/([^/]++)(?|(*:1581)|/availability(*:1603))|b(?|ookings/([^/]++)/(?|tracking(*:1645)|payments/checkout(*:1671))|log/([^/]++)(*:1693))|payments/([^/]++)(*:1720))|/storage/(.*)(?|(*:1746))))/?$}sDu',
    ),
    3 => 
    array (
      58 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'stancl.tenancy.asset',
            'path' => NULL,
          ),
          1 => 
          array (
            0 => 'path',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      97 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'central.tenants.show',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      139 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.media.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'path',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      147 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.me',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      167 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.memberships.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.memberships.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      187 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.memberships.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'membership',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.memberships.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'membership',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      211 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.maintenance.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.maintenance.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      231 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.maintenance.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'maintenance',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      248 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.maintenance.start',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'maintenance',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      267 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.maintenance.complete',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'maintenance',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      280 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.maintenance.cancel',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'maintenance',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      322 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.payments.webhooks.handle',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'gateway',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      365 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.images.store',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      385 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.images.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product',
            2 => 'productImage',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.images.destroy',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product',
            2 => 'productImage',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      395 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.destroy',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      404 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.products.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      444 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.product-units.transfer',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'productUnit',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      452 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.product-units.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.product-units.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      470 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.product-prices.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.product-prices.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      490 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.product-prices.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product_price',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.product-prices.destroy',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'product_price',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      538 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.public-articles.cover',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'publicArticle',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      546 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.public-articles.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'publicArticle',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.public-articles.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'publicArticle',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.public-articles.destroy',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'publicArticle',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      555 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.public-articles.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.public-articles.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      579 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.auth.logout',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      604 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.availability.check',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      649 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.subscription.payments.checkout',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      729 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.subscription.payments.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'payment',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      748 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.settings.show',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.settings.update',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      769 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.settings.images.update',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      786 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.settings.images.destroy',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'image',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      810 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.settings.website-status.update',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      835 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.sales-orders.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.sales-orders.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      855 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.sales-orders.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'salesOrder',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.sales-orders.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'salesOrder',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      879 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.show',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      902 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.business',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      916 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.booking',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      931 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.rental',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      957 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.inventory',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      984 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.pricing',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      999 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.payments',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'PATCH' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1016 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.onboarding.go-live',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1037 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.engines.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1056 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.engines.enable',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1072 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.engines.disable',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1097 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.branches.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.branches.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1118 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.branches.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'branch',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1146 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.branches.sync-master-data',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'branch',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1167 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1188 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'booking',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1214 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.check-out',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'booking',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1228 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.cancel',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'booking',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1244 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.return',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'booking',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1264 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.payments.store',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'booking',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1282 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.bookings.payments.checkout',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'booking',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1333 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.categories.image.store',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'category',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.categories.image.destroy',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'category',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1343 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.categories.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'category',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.categories.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'category',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.categories.destroy',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'category',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1353 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.categories.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.categories.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1374 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.customers.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.customers.store',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1395 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.customers.show',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'customer',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.customers.update',
          ),
          1 => 
          array (
            0 => 'tenant',
            1 => 'customer',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1429 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.inventory.stocks.index',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1448 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.inventory.stocks.adjust',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1465 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.inventory.stocks.transfer',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1495 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.inventory.movements.stocks',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1509 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.inventory.movements.units',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1537 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'tenant.reports.dashboard',
          ),
          1 => 
          array (
            0 => 'tenant',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1581 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.catalog.show',
          ),
          1 => 
          array (
            0 => 'product',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1603 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.catalog.availability',
          ),
          1 => 
          array (
            0 => 'product',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1645 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.bookings.tracking',
          ),
          1 => 
          array (
            0 => 'bookingCode',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1671 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.bookings.payments.checkout',
          ),
          1 => 
          array (
            0 => 'bookingCode',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      1693 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.blog.show',
          ),
          1 => 
          array (
            0 => 'article',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1720 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'public.v1.payments.show',
          ),
          1 => 
          array (
            0 => 'publicPaymentId',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1746 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'storage.local',
          ),
          1 => 
          array (
            0 => 'path',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'storage.local.upload',
          ),
          1 => 
          array (
            0 => 'path',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => NULL,
          1 => NULL,
          2 => NULL,
          3 => NULL,
          4 => false,
          5 => false,
          6 => 0,
        ),
      ),
    ),
    4 => NULL,
  ),
  'attributes' => 
  array (
    'generated::KCI2P1JSgJy8zcCw' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => '/',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'domain' => 'localhost',
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:250:"fn () => \\response()->json([
            \'success\' => true,
            \'data\' => [
                \'service\' => \'Sewantara API\',
                \'status\' => \'running\',
                \'health\' => \\url(\'/api/shared/health\'),
            ],
        ])";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000009a70000000000000000";}}',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::KCI2P1JSgJy8zcCw',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::O9XUJqPiZvkIvC7w' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => '/',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'domain' => 'api.sewantara.test',
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:250:"fn () => \\response()->json([
            \'success\' => true,
            \'data\' => [
                \'service\' => \'Sewantara API\',
                \'status\' => \'running\',
                \'health\' => \\url(\'/api/shared/health\'),
            ],
        ])";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000009f50000000000000000";}}',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::O9XUJqPiZvkIvC7w',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'sanctum.csrf-cookie' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'sanctum/csrf-cookie',
      'action' => 
      array (
        'uses' => 'Laravel\\Sanctum\\Http\\Controllers\\CsrfCookieController@show',
        'controller' => 'Laravel\\Sanctum\\Http\\Controllers\\CsrfCookieController@show',
        'namespace' => NULL,
        'prefix' => 'sanctum',
        'where' => 
        array (
        ),
        'middleware' => 
        array (
          0 => 'web',
        ),
        'as' => 'sanctum.csrf-cookie',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'stancl.tenancy.asset' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'tenancy/assets/{path?}',
      'action' => 
      array (
        'uses' => 'Stancl\\Tenancy\\Controllers\\TenantAssetsController@asset',
        'controller' => 'Stancl\\Tenancy\\Controllers\\TenantAssetsController@asset',
        'as' => 'stancl.tenancy.asset',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
        'path' => '(.*)',
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'shared.health' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/shared/health',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Shared\\HealthController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Shared\\HealthController',
        'as' => 'shared.health',
        'namespace' => NULL,
        'prefix' => 'api/shared',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.business-templates.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/central/business-templates',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\BusinessTemplateController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\BusinessTemplateController@index',
        'as' => 'central.business-templates.index',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.plans.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/central/plans',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\PlanController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\PlanController',
        'as' => 'central.plans.index',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.billing.doku.webhook' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/billing/doku/webhook',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\DokuSubscriptionWebhookController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\DokuSubscriptionWebhookController',
        'as' => 'central.billing.doku.webhook',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.billing.midtrans.webhook' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/billing/midtrans/webhook',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\MidtransSubscriptionWebhookController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\MidtransSubscriptionWebhookController',
        'as' => 'central.billing.midtrans.webhook',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.billing.xendit.webhook' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/billing/xendit/webhook',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\XenditSubscriptionWebhookController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\XenditSubscriptionWebhookController',
        'as' => 'central.billing.xendit.webhook',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.auth.register' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/auth/register',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'throttle:5,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Auth\\RegisterController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Auth\\RegisterController',
        'as' => 'central.auth.register',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.auth.otp.request' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/auth/otp/request',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'throttle:5,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Auth\\RegistrationOtpController@request',
        'controller' => 'App\\Http\\Controllers\\Api\\Auth\\RegistrationOtpController@request',
        'as' => 'central.auth.otp.request',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.auth.otp.verify' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/auth/otp/verify',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'throttle:10,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Auth\\RegistrationOtpController@verify',
        'controller' => 'App\\Http\\Controllers\\Api\\Auth\\RegistrationOtpController@verify',
        'as' => 'central.auth.otp.verify',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.auth.google.redirect' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/central/auth/google/redirect',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'web',
          2 => 'throttle:20,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Auth\\GoogleAuthController@redirect',
        'controller' => 'App\\Http\\Controllers\\Api\\Auth\\GoogleAuthController@redirect',
        'as' => 'central.auth.google.redirect',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.auth.google.callback' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/central/auth/google/callback',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'web',
          2 => 'throttle:20,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Auth\\GoogleAuthController@callback',
        'controller' => 'App\\Http\\Controllers\\Api\\Auth\\GoogleAuthController@callback',
        'as' => 'central.auth.google.callback',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.auth.google.exchange' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/auth/google/exchange',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'throttle:20,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Auth\\GoogleAuthController@exchange',
        'controller' => 'App\\Http\\Controllers\\Api\\Auth\\GoogleAuthController@exchange',
        'as' => 'central.auth.google.exchange',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.tenants.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/central/tenants',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'central.tenants.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\TenantController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\TenantController@index',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.tenants.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/central/tenants',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'central.tenants.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\TenantController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\TenantController@store',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'central.tenants.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/central/tenants/{tenant}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'central.tenants.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Central\\TenantController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Central\\TenantController@show',
        'namespace' => NULL,
        'prefix' => 'api/central',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.auth.login' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/auth/login',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'throttle:5,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantAuthController@login',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantAuthController@login',
        'namespace' => NULL,
        'prefix' => 'api',
        'where' => 
        array (
        ),
        'as' => 'tenant.auth.login',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.media.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/media/{path}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'throttle:240,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantMediaController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantMediaController',
        'as' => 'tenant.media.show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
        'path' => '.*',
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.payments.webhooks.handle' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/payments/webhooks/{gateway}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'throttle:120,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PaymentWebhookController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PaymentWebhookController',
        'as' => 'tenant.payments.webhooks.handle',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.auth.logout' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/auth/logout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantAuthController@logout',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantAuthController@logout',
        'as' => 'tenant.auth.logout',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.me' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/me',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CurrentTenantController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CurrentTenantController',
        'as' => 'tenant.me',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.subscription.payments.checkout' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/subscription/payments/checkout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'throttle:10,1',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\SubscriptionPaymentController@checkout',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\SubscriptionPaymentController@checkout',
        'as' => 'tenant.subscription.payments.checkout',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.subscription.payments.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/subscription/payments/{payment}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\SubscriptionPaymentController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\SubscriptionPaymentController@show',
        'as' => 'tenant.subscription.payments.show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
        'payment' => '[\\da-fA-F]{8}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{12}',
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@show',
        'as' => 'tenant.onboarding.show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.business' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding/business',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@business',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@business',
        'as' => 'tenant.onboarding.business',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.rental' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding/rental',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@rental',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@rental',
        'as' => 'tenant.onboarding.rental',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.inventory' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding/inventory/complete',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@inventory',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@inventory',
        'as' => 'tenant.onboarding.inventory',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.pricing' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding/pricing/complete',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@pricing',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@pricing',
        'as' => 'tenant.onboarding.pricing',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.booking' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding/booking',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@booking',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@booking',
        'as' => 'tenant.onboarding.booking',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.payments' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding/payments',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@payments',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@payments',
        'as' => 'tenant.onboarding.payments',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.onboarding.go-live' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/onboarding/go-live',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@goLive',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantOnboardingController@goLive',
        'as' => 'tenant.onboarding.go-live',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.settings.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/settings',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@show',
        'as' => 'tenant.settings.show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.settings.update' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/settings',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@update',
        'as' => 'tenant.settings.update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.settings.images.update' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/settings/images',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@updateImages',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@updateImages',
        'as' => 'tenant.settings.images.update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.settings.images.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/tenant/{tenant}/settings/images/{image}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@destroyImage',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@destroyImage',
        'as' => 'tenant.settings.images.destroy',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.settings.website-status.update' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/settings/website-status',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@updateWebsiteStatus',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\TenantSettingController@updateWebsiteStatus',
        'as' => 'tenant.settings.website-status.update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.engines.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/engines',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\EngineController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\EngineController@index',
        'as' => 'tenant.engines.index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.engines.enable' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/engines/enable',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\EngineController@enable',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\EngineController@enable',
        'as' => 'tenant.engines.enable',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.engines.disable' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/engines/disable',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\EngineController@disable',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\EngineController@disable',
        'as' => 'tenant.engines.disable',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.branches.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/branches',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.branches.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.branches.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/branches',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.branches.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.branches.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/branches/{branch}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.branches.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.branches.sync-master-data' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/branches/{branch}/sync-master-data',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@syncMasterData',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BranchController@syncMasterData',
        'as' => 'tenant.branches.sync-master-data',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.categories.image.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/categories/{category}/image',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@storeImage',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@storeImage',
        'as' => 'tenant.categories.image.store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.categories.image.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/tenant/{tenant}/categories/{category}/image',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@destroyImage',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@destroyImage',
        'as' => 'tenant.categories.image.destroy',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.categories.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/categories',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.categories.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.categories.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/categories',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.categories.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.categories.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/categories/{category}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.categories.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.categories.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/categories/{category}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.categories.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.categories.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/tenant/{tenant}/categories/{category}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.categories.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CategoryController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.images.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/products/{product}/images',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductImageController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductImageController@store',
        'as' => 'tenant.products.images.store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.images.update' => 
    array (
      'methods' => 
      array (
        0 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/products/{product}/images/{productImage}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductImageController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductImageController@update',
        'as' => 'tenant.products.images.update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.images.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/tenant/{tenant}/products/{product}/images/{productImage}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductImageController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductImageController@destroy',
        'as' => 'tenant.products.images.destroy',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/products',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.products.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/products',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.products.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/products/{product}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.products.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/products/{product}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.products.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.products.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/tenant/{tenant}/products/{product}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.products.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.public-articles.cover' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/public-articles/{publicArticle}/cover',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@cover',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@cover',
        'as' => 'tenant.public-articles.cover',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.public-articles.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/public-articles',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.public-articles.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.public-articles.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/public-articles',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.public-articles.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.public-articles.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/public-articles/{publicArticle}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.public-articles.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.public-articles.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/public-articles/{publicArticle}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.public-articles.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.public-articles.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/tenant/{tenant}/public-articles/{publicArticle}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.public-articles.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PublicArticleController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.product-units.transfer' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/product-units/{productUnit}/transfer',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductUnitController@transfer',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductUnitController@transfer',
        'as' => 'tenant.product-units.transfer',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.product-units.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/product-units',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.product-units.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductUnitController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductUnitController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.product-units.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/product-units',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.product-units.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductUnitController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductUnitController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.product-prices.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/product-prices',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.product-prices.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.product-prices.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/product-prices',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.product-prices.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.product-prices.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/product-prices/{product_price}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.product-prices.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.product-prices.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/tenant/{tenant}/product-prices/{product_price}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.product-prices.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\ProductPriceController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.inventory.stocks.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/inventory/stocks',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryStockController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryStockController@index',
        'as' => 'tenant.inventory.stocks.index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.inventory.stocks.adjust' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/inventory/stocks/adjust',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryStockController@adjust',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryStockController@adjust',
        'as' => 'tenant.inventory.stocks.adjust',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.inventory.stocks.transfer' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/inventory/stocks/transfer',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.accessible',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryStockController@transfer',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryStockController@transfer',
        'as' => 'tenant.inventory.stocks.transfer',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.customers.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/customers',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.customers.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.customers.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/customers',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.customers.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.customers.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/customers/{customer}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.customers.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.customers.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/customers/{customer}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.customers.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\CustomerController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/bookings',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.bookings.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/bookings',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.bookings.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/bookings/{booking}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.bookings.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.check-out' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/bookings/{booking}/check-out',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@checkOut',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@checkOut',
        'as' => 'tenant.bookings.check-out',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.return' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/bookings/{booking}/return',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@return',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@return',
        'as' => 'tenant.bookings.return',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.cancel' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/bookings/{booking}/cancel',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@cancel',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\BookingController@cancel',
        'as' => 'tenant.bookings.cancel',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.payments.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/bookings/{booking}/payments',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PaymentController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PaymentController@store',
        'as' => 'tenant.bookings.payments.store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.bookings.payments.checkout' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/bookings/{booking}/payments/checkout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\PaymentController@checkout',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\PaymentController@checkout',
        'as' => 'tenant.bookings.payments.checkout',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.inventory.movements.stocks' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/inventory/movements/stocks',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryMovementController@stocks',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryMovementController@stocks',
        'as' => 'tenant.inventory.movements.stocks',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.inventory.movements.units' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/inventory/movements/units',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryMovementController@units',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\InventoryMovementController@units',
        'as' => 'tenant.inventory.movements.units',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.maintenance.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/maintenance',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.maintenance.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.maintenance.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/maintenance',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.maintenance.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.maintenance.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/maintenance/{maintenance}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'as' => 'tenant.maintenance.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.maintenance.start' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/maintenance/{maintenance}/start',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@start',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@start',
        'as' => 'tenant.maintenance.start',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.maintenance.complete' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/maintenance/{maintenance}/complete',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@complete',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@complete',
        'as' => 'tenant.maintenance.complete',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.maintenance.cancel' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/maintenance/{maintenance}/cancel',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@cancel',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MaintenanceController@cancel',
        'as' => 'tenant.maintenance.cancel',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.availability.check' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/availability/check',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\AvailabilityController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\AvailabilityController',
        'as' => 'tenant.availability.check',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.reports.dashboard' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/reports/dashboard',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\DashboardReportController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\DashboardReportController',
        'as' => 'tenant.reports.dashboard',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.memberships.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/memberships',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:membership',
        ),
        'as' => 'tenant.memberships.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.memberships.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/memberships',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:membership',
        ),
        'as' => 'tenant.memberships.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.memberships.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/memberships/{membership}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:membership',
        ),
        'as' => 'tenant.memberships.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.memberships.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/memberships/{membership}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:membership',
        ),
        'as' => 'tenant.memberships.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\MembershipController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.sales-orders.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/sales-orders',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:sales',
        ),
        'as' => 'tenant.sales-orders.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@index',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.sales-orders.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/tenant/{tenant}/sales-orders',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:sales',
        ),
        'as' => 'tenant.sales-orders.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@store',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.sales-orders.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/tenant/{tenant}/sales-orders/{salesOrder}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:sales',
        ),
        'as' => 'tenant.sales-orders.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@show',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'tenant.sales-orders.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/tenant/{tenant}/sales-orders/{salesOrder}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'tenant.path',
          2 => 'auth:sanctum',
          3 => 'tenant.user',
          4 => 'tenant.branch',
          5 => 'tenant.active',
          6 => 'tenant.subscription',
          7 => 'tenant.engine:sales',
        ),
        'as' => 'tenant.sales-orders.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Tenant\\SalesOrderController@update',
        'namespace' => NULL,
        'prefix' => 'api/tenant/{tenant}',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::dDiMpRxHzWPjNbcf' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'up',
      'action' => 
      array (
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:1141:"function (\\Illuminate\\Http\\Request $request) {
                    $exception = null;

                    try {
                        \\Illuminate\\Support\\Facades\\Event::dispatch(new \\Illuminate\\Foundation\\Events\\DiagnosingHealth);
                    } catch (\\Throwable $e) {
                        if (app()->hasDebugModeEnabled()) {
                            throw $e;
                        }

                        report($e);

                        $exception = $e->getMessage();
                    }

                    $status = $exception ? 500 : 200;

                    if ($request->expectsJson()) {
                        return response()->json([
                            \'status\' => $exception ? \'down\' : \'up\',
                        ], $status);
                    }

                    return response(\\Illuminate\\Support\\Facades\\View::file(\'C:\\\\laragon\\\\www\\\\sewantara\\\\apps\\\\api\\\\vendor\\\\laravel\\\\framework\\\\src\\\\Illuminate\\\\Foundation\\\\Configuration\'.\'/../resources/health-up.blade.php\', [
                        \'exception\' => $exception,
                    ]), status: $status);
                }";s:5:"scope";s:54:"Illuminate\\Foundation\\Configuration\\ApplicationBuilder";s:4:"this";N;s:4:"self";s:32:"00000000000006cc0000000000000000";}}',
        'as' => 'generated::dDiMpRxHzWPjNbcf',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.health' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'healthz',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\InfrastructureHealthController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\InfrastructureHealthController',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'public.health',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'internal.readiness' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'readyz',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'internal.auth',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\ReadinessController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\ReadinessController',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'internal.readiness',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.tenant' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/tenant',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:read',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\TenantController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\TenantController',
        'as' => 'public.v1.tenant',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.home' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/home',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:read',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\HomeController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\HomeController',
        'as' => 'public.v1.home',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.categories.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/categories',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:read',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\CategoryIndexController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\CategoryIndexController',
        'as' => 'public.v1.categories.index',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.catalog.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/catalog',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:read',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\ProductIndexController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\ProductIndexController',
        'as' => 'public.v1.catalog.index',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.catalog.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/catalog/{product}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:product',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\ProductShowController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\ProductShowController',
        'as' => 'public.v1.catalog.show',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
        'product' => 'public_slug',
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.catalog.availability' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/catalog/{product}/availability',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:availability',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\AvailabilityController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\AvailabilityController',
        'as' => 'public.v1.catalog.availability',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
        'product' => 'public_slug',
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.bookings.quote' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'v1/public/bookings/quote',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:quote',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\QuoteStoreController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\QuoteStoreController',
        'as' => 'public.v1.bookings.quote',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.bookings.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'v1/public/bookings',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:booking',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\BookingStoreController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\BookingStoreController',
        'as' => 'public.v1.bookings.store',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.bookings.tracking' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'v1/public/bookings/{bookingCode}/tracking',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:tracking',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\BookingTrackingController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\BookingTrackingController',
        'as' => 'public.v1.bookings.tracking',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.bookings.payments.checkout' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'v1/public/bookings/{bookingCode}/payments/checkout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:payment',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\BookingPaymentCheckoutController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\BookingPaymentCheckoutController',
        'as' => 'public.v1.bookings.payments.checkout',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.payments.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/payments/{publicPaymentId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:payment',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\PaymentShowController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\PaymentShowController',
        'as' => 'public.v1.payments.show',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.blog.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/blog',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:read',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\ArticleIndexController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\ArticleIndexController',
        'as' => 'public.v1.blog.index',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.blog.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/blog/{article}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:read',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\ArticleShowController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\ArticleShowController',
        'as' => 'public.v1.blog.show',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
        'article' => 'slug',
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'public.v1.sitemap' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'v1/public/sitemap',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'request.id',
          2 => 'force.json',
          3 => 'bff.auth',
          4 => 'public.tenant.headers',
          5 => 'public.tenant.resolve',
          6 => 'public.tenant.eligible',
          7 => 'public.tenant.initialize',
          8 => 'public.tenant.locale',
          9 => 'public.tenant.rate:read',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Public\\SitemapController@__invoke',
        'controller' => 'App\\Http\\Controllers\\Api\\Public\\SitemapController',
        'as' => 'public.v1.sitemap',
        'namespace' => NULL,
        'prefix' => '/v1/public',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::d0WxWO7qfgnTsxan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'POST',
        2 => 'HEAD',
      ),
      'uri' => 'broadcasting/auth',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'uses' => '\\Illuminate\\Broadcasting\\BroadcastController@authenticate',
        'controller' => '\\Illuminate\\Broadcasting\\BroadcastController@authenticate',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'excluded_middleware' => 
        array (
          0 => 'Illuminate\\Foundation\\Http\\Middleware\\PreventRequestForgery',
        ),
        'as' => 'generated::d0WxWO7qfgnTsxan',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'storage.local' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'storage/{path}',
      'action' => 
      array (
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:3:{s:4:"disk";s:5:"local";s:6:"config";a:5:{s:6:"driver";s:5:"local";s:4:"root";s:53:"C:\\laragon\\www\\sewantara\\apps\\api\\storage\\app/private";s:5:"serve";b:1;s:5:"throw";b:0;s:6:"report";b:0;}s:12:"isProduction";b:0;}s:8:"function";s:323:"function (\\Illuminate\\Http\\Request $request, string $path) use ($disk, $config, $isProduction) {
                    return (new \\Illuminate\\Filesystem\\ServeFile(
                        $disk,
                        $config,
                        $isProduction
                    ))($request, $path);
                }";s:5:"scope";s:47:"Illuminate\\Filesystem\\FilesystemServiceProvider";s:4:"this";N;s:4:"self";s:32:"0000000000000a230000000000000000";}}',
        'as' => 'storage.local',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
        'path' => '.*',
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'storage.local.upload' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'storage/{path}',
      'action' => 
      array (
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:3:{s:4:"disk";s:5:"local";s:6:"config";a:5:{s:6:"driver";s:5:"local";s:4:"root";s:53:"C:\\laragon\\www\\sewantara\\apps\\api\\storage\\app/private";s:5:"serve";b:1;s:5:"throw";b:0;s:6:"report";b:0;}s:12:"isProduction";b:0;}s:8:"function";s:325:"function (\\Illuminate\\Http\\Request $request, string $path) use ($disk, $config, $isProduction) {
                    return (new \\Illuminate\\Filesystem\\ReceiveFile(
                        $disk,
                        $config,
                        $isProduction
                    ))($request, $path);
                }";s:5:"scope";s:47:"Illuminate\\Filesystem\\FilesystemServiceProvider";s:4:"this";N;s:4:"self";s:32:"0000000000000a250000000000000000";}}',
        'as' => 'storage.local.upload',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
        'path' => '.*',
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::813bdftL4xbWzsJT' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => '/',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
          1 => 'Stancl\\Tenancy\\Middleware\\InitializeTenancyByDomain',
          2 => 'Stancl\\Tenancy\\Middleware\\ScopeSessions',
          3 => 'Stancl\\Tenancy\\Middleware\\PreventAccessFromCentralDomains',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:123:"function () {
        return \'This is your multi-tenant application. The id of the current tenant is \'.\\tenant(\'id\');
    }";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"0000000000000a2b0000000000000000";}}',
        'namespace' => '',
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::813bdftL4xbWzsJT',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
  ),
)
);
