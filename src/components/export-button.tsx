import { Download } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { BookmarkInstance, BookmarksData } from "../lib/types.ts";
import { addUrlProtocol, escapeHtml, isValidFaviconUrl, isValidHttpUrlScheme } from "../lib/utils.ts";
import { useToast } from "./toast-provider.tsx";
import { Button } from "./ui/button.tsx";

export interface ExportButtonProps {
	bookmarksData: BookmarksData | null;
}

export const ExportButton = ({ bookmarksData }: ExportButtonProps) => {
	const { t } = useTranslation();
	const { showToast } = useToast();

	// Export bookmarks as HTML (Chrome-compatible Netscape Bookmark format)
	const exportAsHTML = useCallback(() => {
		if (!bookmarksData || bookmarksData.bookmarks.length === 0) {
			showToast({
				title: t("Components.Export.error"),
				description: t("Components.Export.noBookmarks"),
				variant: "error",
			});
			return;
		}

		// Group bookmarks by category
		const bookmarksByCategory = bookmarksData.bookmarks.reduce((acc, bookmark) => {
			if (!acc[bookmark.category]) {
				acc[bookmark.category] = [];
			}
			acc[bookmark.category].push(bookmark);
			return acc;
		}, {} as Record<string, BookmarkInstance[]>);

		// Generate HTML content in Netscape Bookmark format
		let htmlContent = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">Bookmarks</H3></DT>
    <DL><p>`;

		// Add bookmarks grouped by category
		for (const [category, bookmarks] of Object.entries(bookmarksByCategory)) {
			// Escape category for HTML
			const escapedCategory = escapeHtml(category);
			htmlContent += `
        <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">${escapedCategory}</H3></DT>
        <DL><p>`;

			for (const bookmark of bookmarks) {
				const addDate = Math.floor(new Date(bookmark.createdAt).getTime() / 1000);
				const lastModified = Math.floor(new Date(bookmark.updatedAt).getTime() / 1000);

				// Validate URL scheme before including in export
				const url = addUrlProtocol(bookmark.url);
				if (!isValidHttpUrlScheme(url)) {
					// Skip bookmarks with invalid URL schemes in export
					console.warn(`Skipping bookmark with invalid URL scheme: ${bookmark.url}`);
					continue;
				}

				// Validate and escape favicon URL
				let safeFavicon = "";
				if (bookmark.favicon && isValidFaviconUrl(bookmark.favicon)) {
					safeFavicon = escapeHtml(bookmark.favicon);
				}

				// Escape title and URL for HTML
				const escapedTitle = escapeHtml(bookmark.title);
				const escapedUrl = escapeHtml(url);

				htmlContent += `
            <DT><A HREF="${escapedUrl}" ADD_DATE="${addDate}" LAST_MODIFIED="${lastModified}" ICON="${safeFavicon}">${escapedTitle}</A></DT>`;
			}

			htmlContent += `
        </p></DL>`;
		}

		htmlContent += `
    </p></DL>
</p></DL>`;

		// Create and download the file
		const blob = new Blob([htmlContent], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = "localmark.html";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

	}, [bookmarksData, showToast, t]);

	// Don't render if no bookmarks
	if (!bookmarksData || bookmarksData.bookmarks.length === 0) {
		return null;
	}

	<div className="w-8 h-8 shrink-0 bg-blue-500/5 rounded-md flex items-center justify-center">
	<Download className="w-4 h-4 text-blue-500/70" />
</div>

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={exportAsHTML}
			className="w-8 h-8 shrink-0 bg-blue-500/5 rounded-md flex items-center justify-center"
			title={t("Components.Export.html")}
		>
			<Download className="w-4 h-4 text-blue-500/70" />
		</Button>
	);
};
