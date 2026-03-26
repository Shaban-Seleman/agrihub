const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#1f6f43" />
  <path
    d="M17 37c0-11.2 7.8-20.3 17.4-20.3 6.7 0 12.6 4.4 15.6 10.8-3-2.2-6.5-3.5-10.1-3.5-8.8 0-15.9 7.2-15.9 16.1 0 2.7.7 5.3 1.9 7.6C20.3 46.4 17 42 17 37Z"
    fill="#f5f0dc"
  />
  <circle cx="42" cy="22" r="5" fill="#f0c419" />
</svg>
`.trim();

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      'content-type': 'image/svg+xml',
      'cache-control': 'public, max-age=31536000, immutable'
    }
  });
}
