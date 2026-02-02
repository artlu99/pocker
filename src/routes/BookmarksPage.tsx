import { useSearchParams } from "wouter";
import { Landing } from "./Landing";
import { BookmarkUI } from "../components/bookmark-ui";
import { useBookmarks } from "../hooks/use-bookmarks";
import { getBaseUrl, getCategories } from "../lib/utils";
import "./bookmarks.css";

export const BookmarksPage = () => {
	const [searchParams] = useSearchParams();

	const status = searchParams.get("status");
	const message = searchParams.get("message");
	let toast: { status: string; message: string } | null = null;
	if (status && message) {
		toast = { status, message };
	}

	const bookmarksData = useBookmarks();
	const categories = getCategories(bookmarksData);
	const baseUrl = getBaseUrl();

	return <>
		{bookmarksData === null && <Landing />}
		<BookmarkUI
			bookmarksData={bookmarksData || null}
			categories={categories}
			toast={toast}
			baseUrl={baseUrl}
		/>
		</>
	
};
