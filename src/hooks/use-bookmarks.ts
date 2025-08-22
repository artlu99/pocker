import type { NonEmptyString100 } from "@evolu/common";
import { useEvolu, useQuery } from "@evolu/react";
import { DEMO_BOOKMARKS_DATA } from "../lib/demo_data";
import { evoluInstance } from "../lib/evolu";
import type { BookmarkInstance } from "../lib/types";
import { isDemoMark, stripUrlProtocol } from "../lib/utils";

export const useBookmarks = (mark: NonEmptyString100) => {
	if (isDemoMark(mark)) {
		return DEMO_BOOKMARKS_DATA;
	}

	const aboutQuery = evoluInstance.createQuery((db) =>
		db.selectFrom("about").select(["version"]).limit(1)
	);
	const aboutData = useQuery(aboutQuery);
	
	if (!aboutData || aboutData.length === 0) {
		return null;
	}

	const bookmarksQuery = evoluInstance.createQuery((db) =>
		db
			.selectFrom("bookmark")
			.select([
				"id",
				"mark",
				"url",
				"title",
				"favicon",
				"description",
				"category",
				"createdAt",
				"updatedAt",
			])
			.where("isDeleted", "is", null)
			.where("mark", "is", mark)
			.orderBy("updatedAt", "desc")
			.limit(100),
	);
	const rows = useQuery(bookmarksQuery);
	return rows
		? {
			mark,
			bookmarks: rows.map((row) => {
				const {
					id,
					url,
					title,
					favicon,
					description,
					category,
					createdAt,
					updatedAt,
				} = row;
				return {
					id,
					url: url ?? "<missing url>",
					title: title ?? "<missing title>",
					favicon: favicon ?? undefined,
					description: description ?? undefined,
					category: category ?? "<no category>",
					createdAt,
					updatedAt,
				};
			}),
		}
		: null;
};

export const useCreateBookmark = () => {
	const { insert } = useEvolu();

	return (bookmark: Omit<BookmarkInstance, "id" | "createdAt" | "updatedAt"> & {
		mark: NonEmptyString100;
	}): BookmarkInstance => {
		const now = new Date().toISOString();
		
		// Transform URL to Base64Url format (strip protocol)
		const transformedBookmark = {
			...bookmark,
			url: stripUrlProtocol(bookmark.url),
		};
		
		if (isDemoMark(bookmark.mark)) {
			// Add timestamp, UUID for demo mode
			return {
				...transformedBookmark,
				id: crypto.randomUUID(),
				createdAt: now,
				updatedAt: now,
			};
		}
		// strip empty description for Evolu schema
		const { description, ...bookmarkWithoutDescription } = transformedBookmark;
		const result = insert("bookmark", description === "" ? bookmarkWithoutDescription : {...bookmarkWithoutDescription, description});
		if (!result.ok) {
			console.error(result.error);
			throw new Error(`Unable to insert for ${bookmark.mark}`);
		}
		return {
			...bookmark,
			id: result.value as unknown as string,
			createdAt: now,
			updatedAt: now,
		};
	};
};

export const useUpdateBookmark = () => {
	const { update } = useEvolu();

	return (bookmark: BookmarkInstance & { mark: string }): BookmarkInstance => {
		// Transform URL to Base64Url format (strip protocol)
		const transformedBookmark = {
			...bookmark,
			url: stripUrlProtocol(bookmark.url),
		};
		
		if (isDemoMark(bookmark.mark)) {
			return {
				...transformedBookmark,
				updatedAt: new Date().toISOString(),
			};
		}
		const { createdAt, updatedAt, favicon, description, ...bookmarkWithoutTimestamps } = transformedBookmark;
		const res = update("bookmark", description === "" ? { ...bookmarkWithoutTimestamps } : {...bookmarkWithoutTimestamps, description});
		// TODO: handle error in optimistic UI
		if (!res.ok) {
			console.error(res.error);
			throw new Error(`Unable to to update ${bookmark.mark}: ${bookmark.id}`);
		}
		return bookmark;
	};
};

export const useDeleteBookmark = () => {
	const { update } = useEvolu();

	return ({ mark, id }: { mark: string; id: string }): void => {
		if (isDemoMark(mark)) {
			return; // Skip server update for demo mode
		}
		update("bookmark", { id, isDeleted: true });
	};
};
