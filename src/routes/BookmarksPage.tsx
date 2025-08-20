import type { NonEmptyString100 } from "@evolu/common";
import { useRoute, useSearchParams } from "wouter";
import { BookmarkUI } from "../components/bookmark-ui";
import { fetchBookmarks } from "../hooks/use-bookmarks";
import { defaultMark, getBaseUrl, getCategories } from "../lib/utils";
import "./bookmarks.css";

export const BookmarksPage = () => {
	const [match, params] = useRoute("/:mark");
	const [searchParams] = useSearchParams();

	const mark = (params?.mark?.slice(0, 99) ?? defaultMark) as NonEmptyString100;
	const status = searchParams.get("status");
	const message = searchParams.get("message");
	let toast: { status: string; message: string } | null = null;
	if (status && message) {
		toast = { status, message };
	}

	const bookmarksData = fetchBookmarks(mark);
	const categories = getCategories(bookmarksData || null);
	const baseUrl = getBaseUrl();

	return match && mark ? (
		<BookmarkUI
			mark={mark}
			bookmarksData={bookmarksData || null}
			categories={categories}
			toast={toast}
			baseUrl={baseUrl}
		/>
	) : null;
};
