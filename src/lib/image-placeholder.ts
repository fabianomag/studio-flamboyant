function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function getImageBlurDataURL(
  background = "#d7e1e3",
  accent = "#9fc1cf",
  line = "#dbe8ec"
) {
  return svgToDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill="url(#g)" />
      <path d="M0 40h64M0 20h64M20 0v64M40 0v64" stroke="${line}" stroke-opacity="0.42" />
    </svg>
  `);
}
