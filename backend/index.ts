import invariant from "tiny-invariant";
import {
	deleteSchema,
	insertSchema,
	updateSchema,
	bookmarkInstanceSchema,
} from "../shared/schema";
import type { NameApi } from "../shared/types";
import type { BookmarkInstance, BookmarksData } from "../shared/types";

const defaultMark = "default";
const defaultCategory = "uncategorized";

export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);

		if (url.pathname.startsWith("/api/bookmarks")) {
			// Handle /api/bookmarks/[mark] endpoint
			const markMatch = url.pathname.match(/^\/api\/bookmarks\/([^/]+)$/);
			if (markMatch) {
				const mark = markMatch[1];

				if (request.method === "GET") {
					const bookmarksData = await env.KV.get<BookmarksData>(
						`bookmarks:${mark}`,
						"json",
					);
					return Response.json(bookmarksData || { mark, bookmarks: [] });
				}
			}

			// Handle /api/bookmarks endpoint
			if (url.pathname === "/api/bookmarks") {
				switch (request.method) {
					case "POST": {
						const body = await request.json();
						const validatedData = insertSchema.parse(body);

						// Get existing bookmarks
						const bookmarksData = (await env.KV.get<BookmarksData>(
							`bookmarks:${validatedData.mark}`,
							"json",
						)) || {
							mark: validatedData.mark,
							bookmarks: [],
						};

						// Create new bookmark with validated timestamp
						const now = new Date().toISOString();
						const bookmark: BookmarkInstance = {
							uuid: crypto.randomUUID(),
							url: validatedData.url,
							title: validatedData.title,
							description: validatedData.description,
							category: validatedData.category,
							createdAt: now,
							modifiedAt: now,
						};

						// Validate the bookmark instance
						bookmarkInstanceSchema.parse(bookmark);

						// Add to bookmarks array
						bookmarksData.bookmarks.push(bookmark);

						// Save back to KV
						await env.KV.put(
							`bookmarks:${validatedData.mark}`,
							JSON.stringify(bookmarksData),
						);

						return Response.json(bookmark);
					}

					case "PUT": {
						const body = await request.json();
						const validatedData = updateSchema.parse(body);

						// Get existing bookmarks
						const bookmarksData = await env.KV.get<BookmarksData>(
							`bookmarks:${validatedData.mark}`,
							"json",
						);
						if (!bookmarksData) {
							return new Response("Bookmark not found", { status: 404 });
						}

						// Find and update the bookmark
						const bookmarkIndex = bookmarksData.bookmarks.findIndex(
							(b) => b.uuid === validatedData.uuid,
						);
						if (bookmarkIndex === -1) {
							return new Response("Bookmark not found", { status: 404 });
						}

						const now = new Date().toISOString();
						const updatedBookmark: BookmarkInstance = {
							...bookmarksData.bookmarks[bookmarkIndex],
							url: validatedData.url,
							title: validatedData.title,
							description: validatedData.description,
							category: validatedData.category,
							modifiedAt: now,
						};

						// Validate the updated bookmark
						bookmarkInstanceSchema.parse(updatedBookmark);

						bookmarksData.bookmarks[bookmarkIndex] = updatedBookmark;

						// Save back to KV
						await env.KV.put(
							`bookmarks:${validatedData.mark}`,
							JSON.stringify(bookmarksData),
						);

						return Response.json(updatedBookmark);
					}

					case "DELETE": {
						const mark = url.searchParams.get("mark");
						const uuid = url.searchParams.get("uuid");

						if (!mark || !uuid) {
							return new Response("Missing required parameters", {
								status: 400,
							});
						}

						const validatedData = deleteSchema.parse({ mark, uuid });

						// Get existing bookmarks
						const bookmarksData = await env.KV.get<BookmarksData>(
							`bookmarks:${validatedData.mark}`,
							"json",
						);
						if (!bookmarksData) {
							return new Response("Bookmark not found", { status: 404 });
						}

						// Remove the bookmark
						const initialLength = bookmarksData.bookmarks.length;
						bookmarksData.bookmarks = bookmarksData.bookmarks.filter(
							(b) => b.uuid !== validatedData.uuid,
						);

						if (bookmarksData.bookmarks.length === initialLength) {
							return new Response("Bookmark not found", { status: 404 });
						}

						// Save back to KV
						await env.KV.put(
							`bookmarks:${validatedData.mark}`,
							JSON.stringify(bookmarksData),
						);

						return new Response(null, { status: 204 });
					}

					default:
						return new Response("Method not allowed", { status: 405 });
				}
			}
		}

		if (url.pathname.startsWith("/api/add")) {
			if (request.method === "GET") {
				const mark = url.searchParams.get("mark");
				const title = url.searchParams.get("title") || "Untitled";
				const urlParam = url.searchParams.get("url");

				// Validate required parameters
				if (!mark) {
					return Response.redirect(
						`/${defaultMark}?status=error&message=${encodeURIComponent("markRequired")}`,
						302,
					);
				}
				if (!urlParam) {
					return Response.redirect(
						`/${defaultMark}?status=error&message=${encodeURIComponent("urlRequired")}`,
						302,
					);
				}

				try {
					// Get existing bookmarks
					const bookmarksData = (await env.KV.get<BookmarksData>(
						`bookmarks:${mark}`,
						"json",
					)) || {
						mark,
						bookmarks: [],
					};

					// Create new bookmark
					const now = new Date().toISOString();
					const bookmark: BookmarkInstance = {
						uuid: crypto.randomUUID(),
						url: urlParam,
						title,
						description: "",
						category: defaultCategory,
						createdAt: now,
						modifiedAt: now,
					};

					// Validate the bookmark instance
					bookmarkInstanceSchema.parse(bookmark);

					// Add to bookmarks array
					bookmarksData.bookmarks.push(bookmark);

					// Save back to KV
					await env.KV.put(`bookmarks:${mark}`, JSON.stringify(bookmarksData));

					return Response.redirect(
						`/${mark}?status=success&message=${encodeURIComponent("bookmarkAdded")}`,
						302,
					);
				} catch (error) {
					console.error("Error processing bookmark:", error);
					return Response.redirect(
						`/${defaultMark}?status=error&message=${encodeURIComponent("processingError")}`,
						302,
					);
				}
			}
		}

		if (url.pathname.startsWith("/api/")) {
			invariant(url.pathname.startsWith("/api/"));

			const res: NameApi = { name: "Cloudflare" };
			return Response.json(res);
		}

		return new Response(null, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
