import { useRoute, useSearchParams } from "wouter";
import { BookmarkUI } from "../components/bookmark-ui";
import { useBookmarks } from "../hooks/use-bookmarks";
import { getBaseUrl, getCategories } from "../lib/utils";
import "./bookmarks.css";

export const BookmarksPage = () => {
	const [match, params] = useRoute("/:mark");
	const [searchParams] = useSearchParams();

	const mark = params?.mark;
	const status = searchParams.get("status");
	const message = searchParams.get("message");
	let toast: { status: string; message: string } | null = null;
	if (status && message) {
		toast = { status, message };
	}

	const { data: bookmarksData, isLoading } = useBookmarks(mark || "");
	const categories = getCategories(bookmarksData || null);
	const baseUrl = getBaseUrl();

	if (isLoading) {
		return <div>Loading...</div>;
	}

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
