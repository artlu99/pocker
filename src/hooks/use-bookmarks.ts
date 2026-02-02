import { sqliteTrue } from "@evolu/common";
import { createUseEvolu, useQuery } from "@evolu/react";
import { useCallback } from "react";
import { evoluInstance } from "../lib/evolu";
import type { BookmarkInstance } from "../lib/types";
import { isValidHttpUrlScheme, stripUrlProtocol } from "../lib/utils";

const useEvolu = createUseEvolu(evoluInstance);

export const useBookmarks = () => {
	const bookmarksQuery = evoluInstance.createQuery((db) =>
		db
			.selectFrom("bookmark")
			.select([
				"id",
				"url",
				"title",
				"favicon",
				"description",
				"category",
				"createdAt",
				"updatedAt",
			])
			.where("isDeleted", "is", null)
			.orderBy("updatedAt", "desc")
			.limit(100),
	);
	const rows = useQuery(bookmarksQuery);

	return (rows && rows.length > 0)
		? {
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

	return useCallback(
		(bookmark: Omit<BookmarkInstance, "id" | "createdAt" | "updatedAt">): BookmarkInstance => {
			const now = new Date().toISOString();

			// Validate URL scheme before storing (only http/https allowed)
			if (!isValidHttpUrlScheme(bookmark.url)) {
				throw new Error("Invalid URL: only http:// and https:// URLs are allowed");
			}

			// Transform URL to Base64Url format (strip protocol)
			const transformedBookmark = {
				...bookmark,
				url: stripUrlProtocol(bookmark.url),
			};

			// strip empty description for Evolu schema
			const { description, ...bookmarkWithoutDescription } =
				transformedBookmark;
			const result = insert(
				"bookmark",
				description === ""
					? bookmarkWithoutDescription
					: { ...bookmarkWithoutDescription, description },
			);
			if (!result.ok) {
				console.error(result.error);
				throw new Error("Unable to insert bookmark");
			}
			return {
				...bookmark,
				id: result.value as unknown as string,
				createdAt: now,
				updatedAt: now,
			};
		},
		[insert],
	);
};

export const useUpdateBookmark = () => {
	const { update } = useEvolu();

	return useCallback(
		(bookmark: BookmarkInstance): BookmarkInstance => {
			// Validate URL scheme before storing (only http/https allowed)
			if (!isValidHttpUrlScheme(bookmark.url)) {
				throw new Error("Invalid URL: only http:// and https:// URLs are allowed");
			}

			// Transform URL to Base64Url format (strip protocol)
			const transformedBookmark = {
				...bookmark,
				url: stripUrlProtocol(bookmark.url),
			};

			const {
				createdAt,
				updatedAt,
				favicon,
				description,
				...bookmarkWithoutTimestamps
			} = transformedBookmark;
			const res = update(
				"bookmark",
				description === ""
					? { ...bookmarkWithoutTimestamps }
					: { ...bookmarkWithoutTimestamps, description },
			);
			// TODO: handle error in optimistic UI
			if (!res.ok) {
				console.error(res.error);
				throw new Error(`Unable to to update bookmark: ${bookmark.id}`);
			}
			return bookmark;
		},
		[update],
	);
};

export const useDeleteBookmark = () => {
	const { update } = useEvolu();

	return useCallback(
		({ id }: { id: string }): void => {
			update("bookmark", { id, isDeleted: sqliteTrue });
		},
		[update],
	);
};
