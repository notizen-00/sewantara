<?php return array (
  'concurrency' => 
  array (
    'default' => 'process',
  ),
  'hashing' => 
  array (
    'driver' => 'bcrypt',
    'bcrypt' => 
    array (
      'rounds' => '10',
      'verify' => true,
      'limit' => NULL,
    ),
    'argon' => 
    array (
      'memory' => 65536,
      'threads' => 1,
      'time' => 4,
      'verify' => true,
    ),
    'rehash_on_login' => true,
  ),
  'images' => 
  array (
    'default' => 'gd',
  ),
  'view' => 
  array (
    'paths' => 
    array (
      0 => 'C:\\laragon\\www\\sewantara\\apps\\api\\resources\\views',
    ),
    'compiled' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\framework\\views',
  ),
  'app' => 
  array (
    'name' => 'Sewantara',
    'env' => 'local',
    'debug' => true,
    'url' => 'http://sewantara.test',
    'frontend_url' => 'http://localhost:3000',
    'asset_url' => NULL,
    'timezone' => 'Asia/Jakarta',
    'locale' => 'id',
    'fallback_locale' => 'id',
    'faker_locale' => 'id_ID',
    'cipher' => 'AES-256-CBC',
    'key' => 'base64:HbPof9wpVYMmc4g1TW4S8VB8r+3jLdpqRrUDE+EVewU=',
    'previous_keys' => 
    array (
    ),
    'maintenance' => 
    array (
      'driver' => 'file',
      'store' => 'database',
    ),
    'providers' => 
    array (
      0 => 'Illuminate\\Auth\\AuthServiceProvider',
      1 => 'Illuminate\\Broadcasting\\BroadcastServiceProvider',
      2 => 'Illuminate\\Bus\\BusServiceProvider',
      3 => 'Illuminate\\Cache\\CacheServiceProvider',
      4 => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
      5 => 'Illuminate\\Concurrency\\ConcurrencyServiceProvider',
      6 => 'Illuminate\\Cookie\\CookieServiceProvider',
      7 => 'Illuminate\\Database\\DatabaseServiceProvider',
      8 => 'Illuminate\\Encryption\\EncryptionServiceProvider',
      9 => 'Illuminate\\Filesystem\\FilesystemServiceProvider',
      10 => 'Illuminate\\Image\\ImageServiceProvider',
      11 => 'Illuminate\\Foundation\\Providers\\FoundationServiceProvider',
      12 => 'Illuminate\\Hashing\\HashServiceProvider',
      13 => 'Illuminate\\Mail\\MailServiceProvider',
      14 => 'Illuminate\\Notifications\\NotificationServiceProvider',
      15 => 'Illuminate\\Pagination\\PaginationServiceProvider',
      16 => 'Illuminate\\Auth\\Passwords\\PasswordResetServiceProvider',
      17 => 'Illuminate\\Pipeline\\PipelineServiceProvider',
      18 => 'Illuminate\\Queue\\QueueServiceProvider',
      19 => 'Illuminate\\Redis\\RedisServiceProvider',
      20 => 'Illuminate\\Session\\SessionServiceProvider',
      21 => 'Illuminate\\Translation\\TranslationServiceProvider',
      22 => 'Illuminate\\Validation\\ValidationServiceProvider',
      23 => 'Illuminate\\View\\ViewServiceProvider',
      24 => 'App\\Providers\\AppServiceProvider',
      25 => 'App\\Modules\\Tenancy\\TenancyServiceProvider',
      26 => 'App\\Modules\\TenantOnboarding\\TenantOnboardingServiceProvider',
      27 => 'App\\Modules\\Payments\\PaymentsServiceProvider',
      28 => 'App\\Modules\\SubscriptionBilling\\SubscriptionBillingServiceProvider',
      29 => 'App\\Modules\\ProductEngine\\ProductEngineServiceProvider',
    ),
    'aliases' => 
    array (
      'App' => 'Illuminate\\Support\\Facades\\App',
      'Arr' => 'Illuminate\\Support\\Arr',
      'Artisan' => 'Illuminate\\Support\\Facades\\Artisan',
      'Auth' => 'Illuminate\\Support\\Facades\\Auth',
      'Benchmark' => 'Illuminate\\Support\\Benchmark',
      'Blade' => 'Illuminate\\Support\\Facades\\Blade',
      'Broadcast' => 'Illuminate\\Support\\Facades\\Broadcast',
      'Bus' => 'Illuminate\\Support\\Facades\\Bus',
      'Cache' => 'Illuminate\\Support\\Facades\\Cache',
      'Concurrency' => 'Illuminate\\Support\\Facades\\Concurrency',
      'Config' => 'Illuminate\\Support\\Facades\\Config',
      'Context' => 'Illuminate\\Support\\Facades\\Context',
      'Cookie' => 'Illuminate\\Support\\Facades\\Cookie',
      'Crypt' => 'Illuminate\\Support\\Facades\\Crypt',
      'Date' => 'Illuminate\\Support\\Facades\\Date',
      'DB' => 'Illuminate\\Support\\Facades\\DB',
      'Eloquent' => 'Illuminate\\Database\\Eloquent\\Model',
      'Event' => 'Illuminate\\Support\\Facades\\Event',
      'File' => 'Illuminate\\Support\\Facades\\File',
      'Gate' => 'Illuminate\\Support\\Facades\\Gate',
      'Hash' => 'Illuminate\\Support\\Facades\\Hash',
      'Http' => 'Illuminate\\Support\\Facades\\Http',
      'Image' => 'Illuminate\\Support\\Facades\\Image',
      'Js' => 'Illuminate\\Support\\Js',
      'Lang' => 'Illuminate\\Support\\Facades\\Lang',
      'Log' => 'Illuminate\\Support\\Facades\\Log',
      'Mail' => 'Illuminate\\Support\\Facades\\Mail',
      'Notification' => 'Illuminate\\Support\\Facades\\Notification',
      'Number' => 'Illuminate\\Support\\Number',
      'Password' => 'Illuminate\\Support\\Facades\\Password',
      'Process' => 'Illuminate\\Support\\Facades\\Process',
      'Queue' => 'Illuminate\\Support\\Facades\\Queue',
      'RateLimiter' => 'Illuminate\\Support\\Facades\\RateLimiter',
      'Redirect' => 'Illuminate\\Support\\Facades\\Redirect',
      'Request' => 'Illuminate\\Support\\Facades\\Request',
      'Response' => 'Illuminate\\Support\\Facades\\Response',
      'Route' => 'Illuminate\\Support\\Facades\\Route',
      'Schedule' => 'Illuminate\\Support\\Facades\\Schedule',
      'Schema' => 'Illuminate\\Support\\Facades\\Schema',
      'Session' => 'Illuminate\\Support\\Facades\\Session',
      'Storage' => 'Illuminate\\Support\\Facades\\Storage',
      'Str' => 'Illuminate\\Support\\Str',
      'Uri' => 'Illuminate\\Support\\Uri',
      'URL' => 'Illuminate\\Support\\Facades\\URL',
      'Validator' => 'Illuminate\\Support\\Facades\\Validator',
      'View' => 'Illuminate\\Support\\Facades\\View',
      'Vite' => 'Illuminate\\Support\\Facades\\Vite',
    ),
  ),
  'auth' => 
  array (
    'defaults' => 
    array (
      'guard' => 'web',
      'passwords' => 'users',
    ),
    'guards' => 
    array (
      'web' => 
      array (
        'driver' => 'session',
        'provider' => 'users',
      ),
      'sanctum' => 
      array (
        'driver' => 'sanctum',
        'provider' => NULL,
      ),
    ),
    'providers' => 
    array (
      'users' => 
      array (
        'driver' => 'eloquent',
        'model' => 'App\\Models\\User',
      ),
    ),
    'passwords' => 
    array (
      'users' => 
      array (
        'provider' => 'users',
        'table' => 'password_reset_tokens',
        'expire' => 60,
        'throttle' => 60,
      ),
    ),
    'password_timeout' => 10800,
  ),
  'broadcasting' => 
  array (
    'default' => 'reverb',
    'connections' => 
    array (
      'reverb' => 
      array (
        'driver' => 'reverb',
        'key' => 'local-reverb-key',
        'secret' => 'local-reverb-secret',
        'app_id' => 'sewantara',
        'options' => 
        array (
          'host' => '127.0.0.1',
          'port' => '8080',
          'scheme' => 'http',
          'useTLS' => false,
        ),
        'client_options' => 
        array (
        ),
      ),
      'pusher' => 
      array (
        'driver' => 'pusher',
        'key' => NULL,
        'secret' => NULL,
        'app_id' => NULL,
        'options' => 
        array (
          'cluster' => NULL,
          'host' => 'api-mt1.pusher.com',
          'port' => 443,
          'scheme' => 'https',
          'encrypted' => true,
          'useTLS' => true,
        ),
        'client_options' => 
        array (
        ),
      ),
      'ably' => 
      array (
        'driver' => 'ably',
        'key' => NULL,
      ),
      'log' => 
      array (
        'driver' => 'log',
      ),
      'null' => 
      array (
        'driver' => 'null',
      ),
    ),
  ),
  'cache' => 
  array (
    'default' => 'redis',
    'stores' => 
    array (
      'array' => 
      array (
        'driver' => 'array',
        'serialize' => false,
      ),
      'session' => 
      array (
        'driver' => 'session',
        'key' => '_cache',
      ),
      'database' => 
      array (
        'driver' => 'database',
        'connection' => 'pgsql',
        'table' => 'cache',
        'lock_connection' => NULL,
        'lock_table' => NULL,
      ),
      'file' => 
      array (
        'driver' => 'file',
        'path' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\framework/cache/data',
        'lock_path' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\framework/cache/data',
      ),
      'storage' => 
      array (
        'driver' => 'storage',
        'disk' => NULL,
        'path' => 'framework/cache/data',
      ),
      'memcached' => 
      array (
        'driver' => 'memcached',
        'persistent_id' => NULL,
        'sasl' => 
        array (
          0 => NULL,
          1 => NULL,
        ),
        'options' => 
        array (
        ),
        'servers' => 
        array (
          0 => 
          array (
            'host' => '127.0.0.1',
            'port' => 11211,
            'weight' => 100,
          ),
        ),
      ),
      'redis' => 
      array (
        'driver' => 'redis',
        'connection' => 'cache',
        'lock_connection' => 'default',
      ),
      'dynamodb' => 
      array (
        'driver' => 'dynamodb',
        'key' => NULL,
        'secret' => NULL,
        'region' => 'us-east-1',
        'table' => 'cache',
        'endpoint' => NULL,
      ),
      'octane' => 
      array (
        'driver' => 'octane',
      ),
      'failover' => 
      array (
        'driver' => 'failover',
        'stores' => 
        array (
          0 => 'database',
          1 => 'array',
        ),
      ),
    ),
    'prefix' => 'sewantara-cache-',
    'serializable_classes' => false,
  ),
  'cors' => 
  array (
    'paths' => 
    array (
      0 => 'api/*',
      1 => 'sanctum/csrf-cookie',
    ),
    'allowed_methods' => 
    array (
      0 => '*',
    ),
    'allowed_origins' => 
    array (
      0 => 'http://localhost:3000',
      1 => 'http://localhost:3001',
      2 => 'http://localhost:3003',
      3 => 'http://localhost:3005',
    ),
    'allowed_origins_patterns' => 
    array (
      0 => '/^http:\\/\\/([a-z0-9-]+\\.)?sewantara\\.test(:[0-9]+)?$/',
    ),
    'allowed_headers' => 
    array (
      0 => '*',
    ),
    'exposed_headers' => 
    array (
      0 => 'X-Branch-Id',
    ),
    'max_age' => 0,
    'supports_credentials' => true,
  ),
  'database' => 
  array (
    'default' => 'pgsql',
    'connections' => 
    array (
      'sqlite' => 
      array (
        'driver' => 'sqlite',
        'url' => NULL,
        'database' => 'sewantara_app',
        'prefix' => '',
        'foreign_key_constraints' => true,
        'busy_timeout' => NULL,
        'journal_mode' => NULL,
        'synchronous' => NULL,
        'transaction_mode' => 'DEFERRED',
      ),
      'mysql' => 
      array (
        'driver' => 'mysql',
        'url' => NULL,
        'host' => '127.0.0.1',
        'port' => '5432',
        'database' => 'sewantara_app',
        'username' => 'postgres',
        'password' => '',
        'unix_socket' => '',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'prefix_indexes' => true,
        'strict' => true,
        'engine' => NULL,
        'options' => 
        array (
        ),
      ),
      'mariadb' => 
      array (
        'driver' => 'mariadb',
        'url' => NULL,
        'host' => '127.0.0.1',
        'port' => '5432',
        'database' => 'sewantara_app',
        'username' => 'postgres',
        'password' => '',
        'unix_socket' => '',
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'prefix_indexes' => true,
        'strict' => true,
        'engine' => NULL,
        'options' => 
        array (
        ),
      ),
      'pgsql' => 
      array (
        'driver' => 'pgsql',
        'url' => NULL,
        'host' => '127.0.0.1',
        'port' => '5432',
        'database' => 'sewantara_app',
        'username' => 'postgres',
        'password' => '',
        'charset' => 'utf8',
        'prefix' => '',
        'prefix_indexes' => true,
        'search_path' => 'public',
        'sslmode' => 'prefer',
      ),
      'sqlsrv' => 
      array (
        'driver' => 'sqlsrv',
        'url' => NULL,
        'host' => '127.0.0.1',
        'port' => '5432',
        'database' => 'sewantara_app',
        'username' => 'postgres',
        'password' => '',
        'charset' => 'utf8',
        'prefix' => '',
        'prefix_indexes' => true,
      ),
    ),
    'migrations' => 
    array (
      'table' => 'migrations',
      'update_date_on_publish' => true,
    ),
    'redis' => 
    array (
      'client' => 'predis',
      'options' => 
      array (
        'cluster' => 'redis',
        'prefix' => 'sewantara-database-',
        'persistent' => false,
      ),
      'default' => 
      array (
        'url' => NULL,
        'host' => '127.0.0.1',
        'username' => NULL,
        'password' => NULL,
        'port' => '6379',
        'database' => '0',
        'max_retries' => 3,
        'backoff_algorithm' => 'decorrelated_jitter',
        'backoff_base' => 100,
        'backoff_cap' => 1000,
      ),
      'cache' => 
      array (
        'url' => NULL,
        'host' => '127.0.0.1',
        'username' => NULL,
        'password' => NULL,
        'port' => '6379',
        'database' => '1',
        'max_retries' => 3,
        'backoff_algorithm' => 'decorrelated_jitter',
        'backoff_base' => 100,
        'backoff_cap' => 1000,
      ),
    ),
  ),
  'filesystems' => 
  array (
    'default' => 'local',
    'disks' => 
    array (
      'local' => 
      array (
        'driver' => 'local',
        'root' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\app/private',
        'serve' => true,
        'throw' => false,
        'report' => false,
      ),
      'public' => 
      array (
        'driver' => 'local',
        'root' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\app/public',
        'url' => 'http://sewantara.test/storage',
        'visibility' => 'public',
        'throw' => false,
        'report' => false,
      ),
      's3' => 
      array (
        'driver' => 's3',
        'key' => NULL,
        'secret' => NULL,
        'region' => NULL,
        'bucket' => NULL,
        'url' => NULL,
        'endpoint' => NULL,
        'use_path_style_endpoint' => false,
        'throw' => false,
        'report' => false,
      ),
    ),
    'links' => 
    array (
      'C:\\laragon\\www\\sewantara\\apps\\api\\public\\storage' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\app/public',
    ),
  ),
  'laravel-subscriptions' => 
  array (
    'tables' => 
    array (
      'plans' => 'plans',
      'features' => 'features',
      'subscriptions' => 'subscriptions',
      'subscription_usage' => 'subscription_usage',
    ),
    'models' => 
    array (
      'plan' => 'Laravelcm\\Subscriptions\\Models\\Plan',
      'feature' => 'Laravelcm\\Subscriptions\\Models\\Feature',
      'subscription' => 'Laravelcm\\Subscriptions\\Models\\Subscription',
      'subscription_usage' => 'Laravelcm\\Subscriptions\\Models\\SubscriptionUsage',
    ),
  ),
  'logging' => 
  array (
    'default' => 'stack',
    'deprecations' => 
    array (
      'channel' => 'null',
      'trace' => false,
    ),
    'channels' => 
    array (
      'stack' => 
      array (
        'driver' => 'stack',
        'channels' => 
        array (
          0 => 'single',
        ),
        'ignore_exceptions' => false,
      ),
      'single' => 
      array (
        'driver' => 'single',
        'path' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\logs/laravel.log',
        'level' => 'debug',
        'replace_placeholders' => true,
      ),
      'daily' => 
      array (
        'driver' => 'daily',
        'path' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\logs/laravel.log',
        'level' => 'debug',
        'days' => 14,
        'replace_placeholders' => true,
      ),
      'monthly' => 
      array (
        'driver' => 'monthly',
        'path' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\logs/laravel.log',
        'level' => 'debug',
        'max_files' => 3,
        'replace_placeholders' => true,
      ),
      'slack' => 
      array (
        'driver' => 'slack',
        'url' => NULL,
        'username' => 'Sewantara',
        'emoji' => ':boom:',
        'level' => 'debug',
        'replace_placeholders' => true,
      ),
      'papertrail' => 
      array (
        'driver' => 'monolog',
        'level' => 'debug',
        'handler' => 'Monolog\\Handler\\SyslogUdpHandler',
        'handler_with' => 
        array (
          'host' => NULL,
          'port' => NULL,
          'connectionString' => 'tls://:',
        ),
        'processors' => 
        array (
          0 => 'Monolog\\Processor\\PsrLogMessageProcessor',
        ),
      ),
      'stderr' => 
      array (
        'driver' => 'monolog',
        'level' => 'debug',
        'handler' => 'Monolog\\Handler\\StreamHandler',
        'handler_with' => 
        array (
          'stream' => 'php://stderr',
        ),
        'formatter' => NULL,
        'processors' => 
        array (
          0 => 'Monolog\\Processor\\PsrLogMessageProcessor',
        ),
      ),
      'syslog' => 
      array (
        'driver' => 'syslog',
        'level' => 'debug',
        'facility' => 8,
        'replace_placeholders' => true,
      ),
      'errorlog' => 
      array (
        'driver' => 'errorlog',
        'level' => 'debug',
        'replace_placeholders' => true,
      ),
      'null' => 
      array (
        'driver' => 'monolog',
        'handler' => 'Monolog\\Handler\\NullHandler',
      ),
      'emergency' => 
      array (
        'path' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\logs/laravel.log',
      ),
    ),
  ),
  'mail' => 
  array (
    'default' => 'log',
    'mailers' => 
    array (
      'smtp' => 
      array (
        'transport' => 'smtp',
        'scheme' => NULL,
        'url' => NULL,
        'host' => '127.0.0.1',
        'port' => '2525',
        'username' => NULL,
        'password' => NULL,
        'timeout' => NULL,
        'local_domain' => 'sewantara.test',
      ),
      'ses' => 
      array (
        'transport' => 'ses',
      ),
      'postmark' => 
      array (
        'transport' => 'postmark',
      ),
      'resend' => 
      array (
        'transport' => 'resend',
      ),
      'sendmail' => 
      array (
        'transport' => 'sendmail',
        'path' => '/usr/sbin/sendmail -bs -i',
      ),
      'log' => 
      array (
        'transport' => 'log',
        'channel' => NULL,
      ),
      'array' => 
      array (
        'transport' => 'array',
      ),
      'failover' => 
      array (
        'transport' => 'failover',
        'mailers' => 
        array (
          0 => 'smtp',
          1 => 'log',
        ),
        'retry_after' => 60,
      ),
      'roundrobin' => 
      array (
        'transport' => 'roundrobin',
        'mailers' => 
        array (
          0 => 'ses',
          1 => 'postmark',
        ),
        'retry_after' => 60,
      ),
    ),
    'from' => 
    array (
      'address' => 'noreply@sewantara.test',
      'name' => 'Sewantara',
    ),
    'markdown' => 
    array (
      'theme' => 'default',
      'paths' => 
      array (
        0 => 'C:\\laragon\\www\\sewantara\\apps\\api\\resources\\views/vendor/mail',
      ),
      'extensions' => 
      array (
      ),
    ),
  ),
  'payments' => 
  array (
    'default' => 'midtrans',
    'drivers' => 
    array (
      'midtrans' => 'App\\Modules\\Payments\\Infrastructure\\Midtrans\\MidtransPaymentGateway',
    ),
  ),
  'postman' => 
  array (
    'name' => 'Sewantara',
    'description' => 'API Documentation',
    'base_url' => 'http://sewantara.test',
    'routes' => 
    array (
      'prefix' => 'api',
      'include' => 
      array (
        'patterns' => 
        array (
        ),
        'middleware' => 
        array (
        ),
        'controllers' => 
        array (
        ),
      ),
      'exclude' => 
      array (
        'patterns' => 
        array (
        ),
        'middleware' => 
        array (
        ),
        'controllers' => 
        array (
        ),
      ),
    ),
    'structure' => 
    array (
      'folders' => 
      array (
        'strategy' => 'nested_path',
        'max_depth' => 10,
        'mapping' => 
        array (
        ),
      ),
      'naming_format' => '[{method}] {uri}',
      'requests' => 
      array (
        'default_body_type' => 'raw',
        'default_values' => 
        array (
          'email' => 'owner@example.test',
          'password' => '<TENANT_PASSWORD>',
          'device_name' => 'web',
          'plan_id' => 1,
          'branch_id' => 1,
          'customer_id' => 1,
          'category_id' => 1,
          'parent_id' => 1,
          'product_id' => 1,
          'sort_order' => 0,
          'inventory_type' => 'serialized',
          'default_pricing_type' => 'daily',
        ),
      ),
    ),
    'auth' => 
    array (
      'enabled' => true,
      'type' => 'bearer',
      'location' => 'header',
      'default' => 
      array (
        'token' => 'your-access-token',
        'username' => 'user@example.com',
        'password' => 'password',
        'key_name' => 'X-API-KEY',
        'key_value' => 'your-api-key-here',
      ),
      'protected_middleware' => 
      array (
        0 => 'auth:sanctum',
      ),
    ),
    'headers' => 
    array (
      'Accept' => 'application/json',
      'Content-Type' => 'application/json',
    ),
    'output' => 
    array (
      'driver' => 'local',
      'path' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\postman',
      'filename' => 'api_collection.json',
    ),
  ),
  'public-api' => 
  array (
    'api_host' => 'api.sewantara.test',
    'trusted_hosts' => 
    array (
      0 => 'api.sewantara.test',
    ),
    'trusted_proxy_ips' => 
    array (
    ),
    'enabled' => true,
    'bff_tokens' => 
    array (
      'current' => 'local-bff-token',
    ),
    'trusted_bff_ips' => 
    array (
    ),
    'internal_health_token' => 'local-health-token',
    'readiness_cache_store' => 'redis',
    'resolution_cache_store' => 'redis',
    'content_cache_store' => 'redis',
    'idempotency_cache_store' => 'redis',
    'public_media_base_url' => '/api/public',
    'tenant_base_domain' => 'sewantara.test',
    'reserved_slugs' => 
    array (
      0 => 'www',
      1 => 'api',
      2 => 'app',
      3 => 'admin',
      4 => 'dashboard',
      5 => 'auth',
      6 => 'login',
      7 => 'register',
      8 => 'support',
      9 => 'help',
      10 => 'status',
      11 => 'static',
      12 => 'assets',
      13 => 'cdn',
      14 => 'mail',
      15 => 'email',
      16 => 'billing',
      17 => 'payment',
      18 => 'payments',
      19 => 'checkout',
      20 => 'webhook',
      21 => 'webhooks',
      22 => 'docs',
      23 => 'developer',
      24 => 'developers',
      25 => 'health',
      26 => 'healthz',
      27 => 'internal',
      28 => 'system',
      29 => 'root',
      30 => 'null',
      31 => 'undefined',
    ),
    'resolution_cache_ttl' => 300,
    'content_cache_ttl' => 300,
    'quote_ttl_minutes' => 15,
    'payment_ttl_minutes' => 30,
    'stock_hold_ttl_minutes' => 20,
    'idempotency_ttl_hours' => 24,
    'expired_subscription_public_read' => false,
    'grace_period_public_read' => true,
    'defaults' => 
    array (
      'timezone' => 'Asia/Jakarta',
      'locale' => 'id-ID',
      'currency' => 'IDR',
    ),
    'translation_locales' => 
    array (
      'id' => 'id',
      'id-id' => 'id',
    ),
    'response_cache' => 
    array (
      'max_age' => 60,
      'shared_max_age' => 300,
      'stale_while_revalidate' => 60,
      'cacheable_routes' => 
      array (
        0 => 'public.v1.tenant',
        1 => 'public.v1.home',
        2 => 'public.v1.categories.*',
        3 => 'public.v1.catalog.*',
        4 => 'public.v1.blog.*',
        5 => 'public.v1.sitemap',
      ),
    ),
    'rate_limits' => 
    array (
      'read' => 
      array (
        'max_attempts' => 120,
        'decay_seconds' => 60,
      ),
      'product' => 
      array (
        'max_attempts' => 180,
        'decay_seconds' => 60,
      ),
      'availability' => 
      array (
        'max_attempts' => 60,
        'decay_seconds' => 60,
      ),
      'quote' => 
      array (
        'max_attempts' => 20,
        'decay_seconds' => 60,
      ),
      'booking' => 
      array (
        'max_attempts' => 10,
        'decay_seconds' => 600,
      ),
      'tracking' => 
      array (
        'max_attempts' => 10,
        'decay_seconds' => 600,
      ),
      'payment' => 
      array (
        'max_attempts' => 30,
        'decay_seconds' => 60,
      ),
    ),
  ),
  'queue' => 
  array (
    'default' => 'redis',
    'connections' => 
    array (
      'sync' => 
      array (
        'driver' => 'sync',
      ),
      'database' => 
      array (
        'driver' => 'database',
        'connection' => NULL,
        'table' => 'jobs',
        'queue' => 'default',
        'retry_after' => 90,
        'after_commit' => false,
      ),
      'beanstalkd' => 
      array (
        'driver' => 'beanstalkd',
        'host' => 'localhost',
        'queue' => 'default',
        'retry_after' => 90,
        'block_for' => 0,
        'after_commit' => false,
      ),
      'sqs' => 
      array (
        'driver' => 'sqs',
        'key' => NULL,
        'secret' => NULL,
        'prefix' => 'https://sqs.us-east-1.amazonaws.com/your-account-id',
        'queue' => 'default',
        'suffix' => NULL,
        'region' => 'us-east-1',
        'after_commit' => false,
      ),
      'redis' => 
      array (
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => 'default',
        'retry_after' => 90,
        'block_for' => NULL,
        'after_commit' => false,
      ),
      'deferred' => 
      array (
        'driver' => 'deferred',
      ),
      'failover' => 
      array (
        'driver' => 'failover',
        'connections' => 
        array (
          0 => 'database',
          1 => 'deferred',
        ),
      ),
      'background' => 
      array (
        'driver' => 'background',
      ),
    ),
    'batching' => 
    array (
      'database' => 'pgsql',
      'table' => 'job_batches',
    ),
    'failed' => 
    array (
      'driver' => 'database-uuids',
      'database' => 'pgsql',
      'table' => 'failed_jobs',
    ),
  ),
  'registration-otp' => 
  array (
    'ttl_minutes' => 5,
    'resend_seconds' => 60,
    'max_attempts' => 5,
    'verified_ttl_minutes' => 30,
  ),
  'reverb' => 
  array (
    'default' => 'reverb',
    'servers' => 
    array (
      'reverb' => 
      array (
        'host' => '0.0.0.0',
        'port' => '8080',
        'path' => '',
        'hostname' => '127.0.0.1',
        'options' => 
        array (
          'tls' => 
          array (
          ),
        ),
        'max_request_size' => 10000,
        'scaling' => 
        array (
          'enabled' => false,
          'channel' => 'reverb',
          'server' => 
          array (
            'url' => NULL,
            'host' => '127.0.0.1',
            'port' => '6379',
            'username' => NULL,
            'password' => NULL,
            'database' => '0',
            'timeout' => 60,
          ),
        ),
        'pulse_ingest_interval' => 15,
        'telescope_ingest_interval' => 15,
      ),
    ),
    'apps' => 
    array (
      'provider' => 'config',
      'apps' => 
      array (
        0 => 
        array (
          'key' => 'local-reverb-key',
          'secret' => 'local-reverb-secret',
          'app_id' => 'sewantara',
          'options' => 
          array (
            'host' => '127.0.0.1',
            'port' => '8080',
            'scheme' => 'http',
            'useTLS' => false,
          ),
          'allowed_origins' => 
          array (
            0 => '*',
          ),
          'ping_interval' => 60,
          'activity_timeout' => 30,
          'max_connections' => NULL,
          'max_message_size' => 10000,
        ),
      ),
    ),
  ),
  'sanctum' => 
  array (
    'stateful' => 
    array (
      0 => 'localhost',
      1 => 'localhost:3000',
      2 => '127.0.0.1',
      3 => '127.0.0.1:8000',
      4 => '::1',
      5 => 'sewantara.test',
    ),
    'guard' => 
    array (
      0 => 'web',
    ),
    'expiration' => NULL,
    'token_prefix' => '',
    'middleware' => 
    array (
      'authenticate_session' => 'Laravel\\Sanctum\\Http\\Middleware\\AuthenticateSession',
      'encrypt_cookies' => 'Illuminate\\Cookie\\Middleware\\EncryptCookies',
      'validate_csrf_token' => 'Illuminate\\Foundation\\Http\\Middleware\\ValidateCsrfToken',
    ),
  ),
  'services' => 
  array (
    'postmark' => 
    array (
      'key' => NULL,
    ),
    'resend' => 
    array (
      'key' => '',
    ),
    'ses' => 
    array (
      'key' => NULL,
      'secret' => NULL,
      'region' => 'us-east-1',
    ),
    'slack' => 
    array (
      'notifications' => 
      array (
        'bot_user_oauth_token' => NULL,
        'channel' => NULL,
      ),
    ),
    'midtrans' => 
    array (
      'server_key' => '',
      'client_key' => '',
      'is_production' => false,
      'is_3ds' => true,
    ),
    'xendit' => 
    array (
      'secret_key' => '',
      'public_key' => '',
      'webhook_token' => '',
      'base_url' => 'https://api.xendit.co',
    ),
    'doku' => 
    array (
      'client_id' => '',
      'secret_key' => '',
      'public_key' => '',
      'base_url' => 'https://api-sandbox.doku.com',
      'payment_due_minutes' => 60,
      'notification_url' => 'http://sewantara.test/api/central/billing/doku/webhook',
    ),
    'google' => 
    array (
      'client_id' => '',
      'client_secret' => '',
      'redirect' => 'http://localhost:8000/api/central/auth/google/callback',
      'frontend_callback' => 'http://localhost:3005/auth/google/callback',
      'exchange_ttl' => 60,
    ),
  ),
  'session' => 
  array (
    'driver' => 'redis',
    'lifetime' => 120,
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => 'C:\\laragon\\www\\sewantara\\apps\\api\\storage\\framework/sessions',
    'connection' => 'default',
    'table' => 'sessions',
    'store' => NULL,
    'lottery' => 
    array (
      0 => 2,
      1 => 100,
    ),
    'cookie' => 'sewantara-session',
    'path' => '/',
    'domain' => NULL,
    'secure' => false,
    'http_only' => true,
    'same_site' => 'lax',
    'partitioned' => false,
    'serialization' => 'json',
  ),
  'subscription-billing' => 
  array (
    'default' => 'xendit',
    'return_urls' => 
    array (
      'success' => 'http://localhost:3005',
      'cancel' => 'http://localhost:3005',
    ),
    'drivers' => 
    array (
      'doku' => 'App\\Modules\\SubscriptionBilling\\Infrastructure\\Doku\\DokuSubscriptionPaymentGateway',
      'midtrans' => 'App\\Modules\\SubscriptionBilling\\Infrastructure\\Midtrans\\MidtransSubscriptionPaymentGateway',
      'xendit' => 'App\\Modules\\SubscriptionBilling\\Infrastructure\\Xendit\\XenditSubscriptionPaymentGateway',
    ),
  ),
  'tenancy' => 
  array (
    'tenant_model' => 'App\\Models\\Tenant',
    'id_generator' => 'Stancl\\Tenancy\\UUIDGenerator',
    'domain_model' => 'App\\Models\\Domain',
    'central_domains' => 
    array (
      0 => 'localhost',
      1 => 'api.sewantara.test',
    ),
    'bootstrappers' => 
    array (
      0 => 'Stancl\\Tenancy\\Bootstrappers\\DatabaseTenancyBootstrapper',
      1 => 'Stancl\\Tenancy\\Bootstrappers\\CacheTenancyBootstrapper',
      2 => 'Stancl\\Tenancy\\Bootstrappers\\FilesystemTenancyBootstrapper',
      3 => 'Stancl\\Tenancy\\Bootstrappers\\QueueTenancyBootstrapper',
    ),
    'database' => 
    array (
      'central_connection' => 'pgsql',
      'template_tenant_connection' => NULL,
      'prefix' => 'tenant',
      'suffix' => '',
      'managers' => 
      array (
        'sqlite' => 'Stancl\\Tenancy\\TenantDatabaseManagers\\SQLiteDatabaseManager',
        'mysql' => 'Stancl\\Tenancy\\TenantDatabaseManagers\\MySQLDatabaseManager',
        'mariadb' => 'Stancl\\Tenancy\\TenantDatabaseManagers\\MySQLDatabaseManager',
        'pgsql' => 'Stancl\\Tenancy\\TenantDatabaseManagers\\PostgreSQLSchemaManager',
      ),
    ),
    'cache' => 
    array (
      'tag_base' => 'tenant',
    ),
    'filesystem' => 
    array (
      'suffix_base' => 'tenant',
      'disks' => 
      array (
        0 => 'local',
        1 => 'public',
      ),
      'root_override' => 
      array (
        'local' => '%storage_path%/app/',
        'public' => '%storage_path%/app/public/',
      ),
      'suffix_storage_path' => true,
      'asset_helper_tenancy' => true,
    ),
    'redis' => 
    array (
      'prefix_base' => 'tenant',
      'prefixed_connections' => 
      array (
      ),
    ),
    'features' => 
    array (
    ),
    'routes' => true,
    'migration_parameters' => 
    array (
      '--force' => true,
      '--path' => 
      array (
        0 => 'C:\\laragon\\www\\sewantara\\apps\\api\\database\\migrations/tenant',
      ),
      '--realpath' => true,
    ),
    'seeder_parameters' => 
    array (
      '--class' => 'DatabaseSeeder',
    ),
    'tenant_base_domain' => 'sewantara.test',
    'registration_defaults' => 
    array (
      'timezone' => 'Asia/Jakarta',
      'currency' => 'IDR',
    ),
    'reserved_subdomains' => 
    array (
      0 => 'www',
      1 => 'api',
      2 => 'app',
      3 => 'admin',
      4 => 'dashboard',
      5 => 'auth',
      6 => 'login',
      7 => 'register',
      8 => 'support',
      9 => 'help',
      10 => 'status',
      11 => 'static',
      12 => 'assets',
      13 => 'cdn',
      14 => 'mail',
      15 => 'email',
      16 => 'billing',
      17 => 'payment',
      18 => 'payments',
      19 => 'checkout',
      20 => 'webhook',
      21 => 'webhooks',
      22 => 'docs',
      23 => 'developer',
      24 => 'developers',
      25 => 'health',
      26 => 'healthz',
      27 => 'internal',
      28 => 'system',
      29 => 'root',
      30 => 'null',
      31 => 'undefined',
      32 => 'localhost',
    ),
  ),
  'eloquent-sortable' => 
  array (
    'order_column_name' => 'order_column',
    'sort_when_creating' => true,
    'ignore_timestamps' => false,
  ),
  'tinker' => 
  array (
    'commands' => 
    array (
    ),
    'alias' => 
    array (
    ),
    'dont_alias' => 
    array (
      0 => 'App\\Nova',
    ),
    'trust_project' => 'always',
  ),
);
