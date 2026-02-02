import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BookmarksData } from "./types";

export const DEFAULT_CATEGORY = "uncategorized";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
	return typeof window !== "undefined"
		? window.location.origin
		: "http://localhost:5173";
};

export const getCategories = (bookmarksdata: BookmarksData | null) => {
	if (!bookmarksdata) {
		return [DEFAULT_CATEGORY];
	}

	const uniqueCategories = [
		...new Set(bookmarksdata.bookmarks.map((bookmark) => bookmark.category)),
	];

	if (!uniqueCategories.includes(DEFAULT_CATEGORY)) {
		return [DEFAULT_CATEGORY, ...uniqueCategories];
	}

	return [
		DEFAULT_CATEGORY,
		...uniqueCategories.filter((category) => category !== DEFAULT_CATEGORY),
	];
};

export const getDomain = (url: string) => {
	return new URL(url).hostname.replace("www.", "");
};

// Remove protocol and any leading slashes
export function stripUrlProtocol(url: string): string {
	return url.replace(/^https?:\/\//, "").replace(/^\/+/, "");
}

// Add https:// protocol to URL for display purposes
// Assumes URLs without protocol should use https
export function addUrlProtocol(url: string): string {
	if (url.match(/^https?:\/\//)) {
		return url; // Already has protocol
	}
	return `https://${url}`;
}

/**
 * Escape HTML special characters to prevent XSS.
 * Converts: & -> &amp;, < -> &lt;, > -> &gt;, " -> &quot;, ' -> &#39;
 */
export function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Validate that a URL has a safe scheme (http or https only).
 * Returns false for javascript:, data:, vbscript:, file:, etc.
 */
export function isValidHttpUrlScheme(url: string): boolean {
	try {
		// Add protocol if missing for validation purposes
		const urlWithProtocol = url.match(/^https?:\/\//)
			? url
			: `https://${url}`;
		const parsed = new URL(urlWithProtocol);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

/**
 * Validate that a favicon URL is safe for use in <img src>.
 * Allows: https:, http:, and data: URLs with image MIME types only.
 * Rejects: javascript:, vbscript:, and non-image data: URLs.
 */
export function isValidFaviconUrl(favicon: string): boolean {
	if (!favicon) return true; // Empty is fine

	try {
		// Check for data: URLs with image MIME types
		if (favicon.startsWith("data:image/")) {
			// Basic check for data:image/ prefix
			return /^data:image\/(png|gif|jpeg|webp|svg\+xml);base64,[a-zA-Z0-9+/=]+$/.test(
				favicon,
			);
		}

		// For regular URLs, only allow http/https
		const urlWithProtocol = favicon.match(/^https?:\/\//)
			? favicon
			: `https://${favicon}`;
		const parsed = new URL(urlWithProtocol);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}
