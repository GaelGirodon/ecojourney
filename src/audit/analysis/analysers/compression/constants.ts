/*
 * Compression reference values from:
 * - https://github.com/h5bp/server-configs-nginx/blob/main/h5bp/web_performance/compression.conf
 * - https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding
 */

/**
 * Size (in bytes) under which compression is useless
 * as the content is unlikely to shrink much if at all
 */
export const minLength = 256;

/**
 * Compression encodings
 */
export const encodings = [
    "gzip",
    "deflate",
    "br"
];

/**
 * Types of content to compress
 */
export const types = [
    "application/atom+xml",
    "application/geo+json",
    "application/javascript",
    "application/x-javascript",
    "application/json",
    "application/ld+json",
    "application/manifest+json",
    "application/rdf+xml",
    "application/rss+xml",
    "application/vnd.ms-fontobject",
    "application/wasm",
    "application/x-web-app-manifest+json",
    "application/xhtml+xml",
    "application/xml",
    "font/eot",
    "font/otf",
    "font/ttf",
    "image/bmp",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/x-icon",
    "text/cache-manifest",
    "text/calendar",
    "text/css",
    "text/javascript",
    "text/markdown",
    "text/plain",
    "text/xml",
    "text/vcard",
    "text/vnd.rim.location.xloc",
    "text/vtt",
    "text/x-component",
    "text/x-cross-domain-policy"
];
