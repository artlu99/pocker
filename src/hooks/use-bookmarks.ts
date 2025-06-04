import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createBookmark,
	deleteBookmark,
	fetchBookmarks,
	updateBookmark,
} from "../api/bookmarks";
import { DEMO_BOOKMARKS_DATA } from "../lib/demo_data";
import { isDemoMark } from "../lib/utils";
import type { BookmarkInstance, BookmarksData } from "../../shared/types";

const bookmarksQueryKey = "bookmarks";

export const useBookmarks = (mark: string) => {
	return useQuery({
		queryKey: [bookmarksQueryKey, mark],
		queryFn: () =>
			isDemoMark(mark) ? DEMO_BOOKMARKS_DATA : fetchBookmarks(mark),
	});
};

export const useCreateBookmark = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			newBookmark: Omit<
				BookmarkInstance,
				"uuid" | "createdAt" | "modifiedAt"
			> & { mark: string },
		) => {
			if (isDemoMark(newBookmark.mark)) {
				// Add timestamps and UUID for demo mode
				const now = new Date().toISOString();
				return {
					...newBookmark,
					uuid: crypto.randomUUID(),
					createdAt: now,
					modifiedAt: now,
				};
			}
			return createBookmark(newBookmark);
		},
		onMutate: async (newBookmark) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: [bookmarksQueryKey, newBookmark.mark],
			});

			// Snapshot the previous value
			const previousBookmarks = queryClient.getQueryData<BookmarksData>([
				bookmarksQueryKey,
				newBookmark.mark,
			]);

			// Create a complete bookmark with timestamps for demo mode
			const now = new Date().toISOString();
			const completeBookmark = isDemoMark(newBookmark.mark)
				? {
						...newBookmark,
						uuid: crypto.randomUUID(),
						createdAt: now,
						modifiedAt: now,
					}
				: newBookmark;

			// Optimistically update to the new value
			queryClient.setQueryData(
				[bookmarksQueryKey, newBookmark.mark],
				(old: BookmarksData | undefined) => {
					if (!old) return old;
					return {
						...old,
						bookmarks: [...old.bookmarks, completeBookmark],
					};
				},
			);

			return { previousBookmarks };
		},
		onError: (_, __, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousBookmarks) {
				queryClient.setQueryData(
					[bookmarksQueryKey, context.previousBookmarks.mark],
					context.previousBookmarks,
				);
			}
		},
		onSettled: (_, __, variables) => {
			// Only refetch if not in demo mode
			if (!isDemoMark(variables.mark)) {
				queryClient.invalidateQueries({
					queryKey: [bookmarksQueryKey, variables.mark],
				});
			}
		},
	});
};

export const useUpdateBookmark = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			updatedBookmark: BookmarkInstance & { mark: string },
		) => {
			if (isDemoMark(updatedBookmark.mark)) {
				return {
					...updatedBookmark,
					modifiedAt: new Date().toISOString(),
				};
			}
			return updateBookmark(updatedBookmark);
		},
		onMutate: async (updatedBookmark) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: [bookmarksQueryKey, updatedBookmark.mark],
			});

			// Snapshot the previous value
			const previousBookmarks = queryClient.getQueryData<BookmarksData>([
				bookmarksQueryKey,
				updatedBookmark.mark,
			]);

			// Update the modifiedAt timestamp for demo mode
			const completeBookmark = isDemoMark(updatedBookmark.mark)
				? {
						...updatedBookmark,
						modifiedAt: new Date().toISOString(),
					}
				: updatedBookmark;

			// Optimistically update to the new value
			queryClient.setQueryData(
				[bookmarksQueryKey, updatedBookmark.mark],
				(old: BookmarksData | undefined) => {
					if (!old) return old;
					return {
						...old,
						bookmarks: old.bookmarks.map((b: BookmarkInstance) =>
							b.uuid === updatedBookmark.uuid ? completeBookmark : b,
						),
					};
				},
			);

			return { previousBookmarks };
		},
		onError: (_, __, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousBookmarks) {
				queryClient.setQueryData(
					[bookmarksQueryKey, context.previousBookmarks.mark],
					context.previousBookmarks,
				);
			}
		},
		onSettled: (_, __, variables) => {
			// Only refetch if not in demo mode
			if (!isDemoMark(variables.mark)) {
				queryClient.invalidateQueries({
					queryKey: [bookmarksQueryKey, variables.mark],
				});
			}
		},
	});
};

export const useDeleteBookmark = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ mark, uuid }: { mark: string; uuid: string }) => {
			if (isDemoMark(mark)) {
				return { mark, uuid }; // Skip server update for demo mode
			}
			return deleteBookmark({ mark, uuid });
		},
		onMutate: async ({ mark, uuid }) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: [bookmarksQueryKey, mark],
			});

			// Snapshot the previous value
			const previousBookmarks = queryClient.getQueryData<BookmarksData>([
				bookmarksQueryKey,
				mark,
			]);

			// Optimistically update to the new value
			queryClient.setQueryData(
				[bookmarksQueryKey, mark],
				(old: BookmarksData | undefined) => {
					if (!old) return old;
					return {
						...old,
						bookmarks: old.bookmarks.filter((b) => b.uuid !== uuid),
					};
				},
			);

			return { previousBookmarks };
		},
		onError: (_, __, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			if (context?.previousBookmarks) {
				queryClient.setQueryData(
					[bookmarksQueryKey, context.previousBookmarks.mark],
					context.previousBookmarks,
				);
			}
		},
		onSettled: (_, __, variables) => {
			// Only refetch if not in demo mode
			if (!isDemoMark(variables.mark)) {
				queryClient.invalidateQueries({
					queryKey: [bookmarksQueryKey, variables.mark],
				});
			}
		},
	});
};
