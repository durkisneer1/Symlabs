<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @php
            $siteName = config('app.name', 'Symlabs');
            $siteDescription = 'Free programming courseware with lessons, practice, quizzes, and classroom tools for web, software, and systems topics.';
            $siteUrl = rtrim(config('app.url'), '/');
            $canonicalUrl = url()->current();
            $openGraphImage = url('/images/symlabs-og.png');
            $schema = [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'EducationalOrganization',
                        '@id' => $siteUrl.'/#organization',
                        'name' => $siteName,
                        'url' => $siteUrl,
                        'logo' => url('/images/brand/symlabs@2x.png'),
                    ],
                    [
                        '@type' => 'WebSite',
                        '@id' => $siteUrl.'/#website',
                        'name' => $siteName,
                        'url' => $siteUrl,
                        'description' => $siteDescription,
                        'publisher' => ['@id' => $siteUrl.'/#organization'],
                        'inLanguage' => str_replace('_', '-', app()->getLocale()),
                    ],
                ],
            ];
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{{ $siteDescription }}">
        <meta name="application-name" content="{{ $siteName }}">
        <meta name="apple-mobile-web-app-title" content="{{ $siteName }}">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <meta name="theme-color" content="#f97316" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)">
        <link rel="canonical" href="{{ $canonicalUrl }}">
        <link rel="alternate" href="{{ $canonicalUrl }}" hreflang="{{ str_replace('_', '-', app()->getLocale()) }}">
        <link rel="alternate" href="{{ $siteUrl }}" hreflang="x-default">
        <link rel="icon" type="image/webp" sizes="40x40" href="/images/brand/icon@0.5x.webp">
        <link rel="icon" type="image/png" sizes="40x40" href="/images/brand/icon@0.5x.png">
        <link rel="icon" type="image/png" sizes="79x79" href="/images/brand/icon@1x.png">
        <link rel="apple-touch-icon" sizes="317x317" href="/images/brand/icon@4x.png">
        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $siteName }} | Free Programming Courseware">
        <meta property="og:description" content="{{ $siteDescription }}">
        <meta property="og:url" content="{{ $canonicalUrl }}">
        <meta property="og:image" content="{{ $openGraphImage }}">
        <meta property="og:image:secure_url" content="{{ $openGraphImage }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $siteName }} programming courseware preview">
        <meta property="og:locale" content="{{ str_replace('-', '_', str_replace('_', '-', app()->getLocale())) }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $siteName }} | Free Programming Courseware">
        <meta name="twitter:description" content="{{ $siteDescription }}">
        <meta name="twitter:image" content="{{ $openGraphImage }}">
        <meta name="twitter:image:alt" content="{{ $siteName }} programming courseware preview">
        <script type="application/ld+json">
            {!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
        </script>
        <script>
            (() => {
                const appearance = @json($appearance ?? 'system');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

                document.documentElement.classList.toggle('dark', isDark);
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
            })();
        </script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
