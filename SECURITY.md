# Security Guidelines

## ⚠️ API Key Security

### Development vs Production

**This app uses AI provider APIs that require authentication.** The default configuration is designed for **local development only** and exposes API keys in the client bundle.

#### Development (Local)
- API keys in `.env` with `VITE_*` prefix are embedded in the client bundle
- Keys are visible in browser DevTools and network requests
- **ONLY use for local testing with throwaway/limited API keys**
- **NEVER deploy this configuration to production**

#### Production (Secure)
For production deployments, you **MUST** use a backend proxy to protect API keys:

1. **Set up proxy endpoints** at `/api/gemini`, `/api/openai`, `/api/anthropic`
2. **Move API keys to server environment** (not VITE_ prefixed)
3. **Proxy handles authentication** server-side, frontend sends requests to `/api/*`

### Proxy Implementation

The engine automatically detects the environment:
- **Node.js (server):** Direct API calls with keys
- **Browser:** Proxy endpoints at `/api/*`

Example proxy setup (Next.js API route):

```typescript
// pages/api/gemini/[...path].ts
export default async function handler(req, res) {
  const path = req.query.path.join('/')
  const apiKey = process.env.GOOGLE_API_KEY // Server-side only

  const response = await fetch(
    `https://generativelanguage.googleapis.com/${path}`,
    {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Add key from server environment
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    }
  )

  const data = await response.json()
  res.status(response.status).json(data)
}
```

Similar proxies needed for `/api/openai` and `/api/anthropic`.

### Best Practices

1. ✅ **Local dev:** Use `.env` with VITE_ prefix, limited keys
2. ✅ **Production:** Proxy through backend, keys in server env
3. ✅ **Rate limiting:** Implement on proxy to prevent abuse
4. ✅ **CORS:** Configure proxy to only accept requests from your domain
5. ❌ **NEVER:** Deploy with client-side VITE_ keys to production
6. ❌ **NEVER:** Commit `.env` to version control (already in `.gitignore`)

### Audit Checklist

Before production deployment:
- [ ] Backend proxy endpoints implemented (`/api/*`)
- [ ] API keys moved to server environment (no VITE_ prefix)
- [ ] `.env` removed from build/deploy artifacts
- [ ] Rate limiting configured on proxy
- [ ] CORS restrictions applied
- [ ] Key rotation plan established

---

**For questions or security concerns, open an issue on GitHub.**
