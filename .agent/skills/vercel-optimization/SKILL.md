---
name: vercel-optimization
description: Vercel deployment, configuration, and performance optimization guide for static sites.
---

# Vercel Optimization Skill

This skill provides a comprehensive guide and best practices for deploying and optimizing static websites on Vercel.

## 1. Configuration (vercel.json)

The `vercel.json` file is crucial for configuring project behavior. Place it in the root directory.

### Recommended Configuration
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/css/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/js/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Key Properties
- **cleanUrls**: Removes `.html` extension from URLs (e.g., `/about.html` -> `/about`).
- **headers**: Sets HTTP headers for security and caching.
    - **Security**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`.
    - **Caching**: `Cache-Control` for static assets (images, css, js). `immutable` is recommended for hashed assets or assets that rarely change.

## 2. Deployment Workflow

### Git Integration (Recommended)
1.  Push code to a Git repository (GitHub/GitLab/Bitbucket).
2.  Import the project in Vercel dashboard.
3.  Vercel automatically deploys on every push to the main branch.

### Vercel CLI (For manual control)
- `vercel`: Deploy to a preview environment.
- `vercel --prod`: Deploy to production.

## 3. Performance Optimization

### Image Optimization
Since this is a static site (HTML/CSS), built-in image optimization like Next.js `next/image` is not available.
- **Format**: Use WebP or AVIF for better compression.
- **Loading**: Add `loading="lazy"` to off-screen images.
- **Sizing**: Specify `width` and `height` attributes to prevent layout shifts (CLS).
- **CSS**: Use `object-fit: cover` or `contain` for responsive images.

### Speed Insights
Enable **Vercel Speed Insights** to monitor real-world performance (Core Web Vitals).
1.  Go to Vercel Project Dashboard > Speed Insights.
2.  Enable it.
3.  Add the code snippet to your HTML `<head>` or `<body>`:
    ```html
    <script>
      window.va = window.va || function () { (window.va.q = window.va.q || []).push(arguments) };
    </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>
    ```

### Analytics
Enable **Web Analytics** for visitor stats.
1.  Go to Vercel Project Dashboard > Analytics.
2.  Enable it.
3.  Add the script:
    ```html
    <script defer src="/_vercel/insights/script.js"></script>
    ```

## 4. Troubleshooting

- **404 on Refresh**: If using a SPA (Single Page App) with client-side routing, you might need a rewrite rule in `vercel.json`:
  ```json
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  ```
- **Cache Not Updating**: Because of the `immutable` header, ensure you change filenames (fingerprinting) or reduce `max-age` if you overwrite files without changing names.

