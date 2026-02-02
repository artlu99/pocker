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
