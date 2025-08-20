import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BookmarksData } from "./types";

export const defaultMark = "default";
// TODO: CHECK THIS
const defaultCategory = "uncategorized";
export const isDemoMark = (mark: string) => mark === "demo";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const generateRandomMark = () => {
	const adjectives = [
		"vacuous",
		"tearful",
		"faint",
		"jumbled",
		"wandering",
		"mature",
		"savory",
		"mighty",
		"disgusted",
		"abstracted",
		"telling",
	];
	const nouns = [
		"person",
		"inspector",
		"significance",
		"chapter",
		"reputation",
		"outcome",
		"association",
		"failure",
		"population",
		"wealth",
		"bird",
	];
	const randomNum = Math.floor(Math.random() * 10000);
	return `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]
		}-${randomNum}`;
};

export const getBaseUrl = () => {
	return (
		import.meta.env.VITE_PUBLIC_BASE_URL ||
		(typeof window !== "undefined"
			? window.location.origin
			: "http://localhost:5173")
	);
};

export const getCategories = (bookmarksdata: BookmarksData | null) => {
	if (!bookmarksdata) {
		return [defaultCategory];
	}

	const uniqueCategories = [
		...new Set(bookmarksdata.bookmarks.map((bookmark) => bookmark.category)),
	];

	if (!uniqueCategories.includes(defaultCategory)) {
		return [defaultCategory, ...uniqueCategories];
	}

	return [
		defaultCategory,
		...uniqueCategories.filter((category) => category !== defaultCategory),
	];
};

export const getDomain = (url: string) => {
	return new URL(url).hostname.replace("www.", "");
};

// Remove protocol and any leading slashes
export function stripUrlProtocol(url: string): string {	
	return url.replace(/^https?:\/\//, '').replace(/^\/+/, '');
}

// Add https:// protocol to URL for display purposes
// Assumes URLs without protocol should use https
export function addUrlProtocol(url: string): string {
	if (url.match(/^https?:\/\//)) {
		return url; // Already has protocol
	}
	return `https://${url}`;
}
