import { fetcher } from "itty-fetcher";
import type { BookmarkInstance, BookmarksData } from "../../shared/types";
import { getBaseUrl } from "../lib/utils";

const api = fetcher({ base: getBaseUrl() });

export const fetchBookmarks = async (mark: string): Promise<BookmarksData> => {
	const res = await api.get<BookmarksData>(`/api/bookmarks/${mark}`);
	return res;
};

export const createBookmark = async (
	bookmark: Omit<BookmarkInstance, "uuid" | "createdAt" | "modifiedAt"> & {
		mark: string;
	},
): Promise<BookmarkInstance> => {
	const res = await api.post<BookmarkInstance>("/api/bookmarks", bookmark);
	return res;
};

export const updateBookmark = async (
	bookmark: BookmarkInstance & { mark: string },
): Promise<BookmarkInstance> => {
	const res = await api.put<BookmarkInstance>("/api/bookmarks", bookmark);
	return res;
};

export const deleteBookmark = async ({
	mark,
	uuid,
}: {
	mark: string;
	uuid: string;
}): Promise<void> => {
	const res = await api.delete<void>(
		`/api/bookmarks?mark=${encodeURIComponent(mark)}&uuid=${encodeURIComponent(uuid)}`,
	);
	return res;
};

// Favicon helper
export async function getFavicon(url: string, size = 64) {
	const domain = new URL(url).hostname.replace("www.", "");
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}
