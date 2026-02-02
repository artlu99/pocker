import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export const baseSchema = z.object({
	url: z.string()
		.min(1, "URL is required")
		.refine((url) => {
			// Add protocol if missing for validation
			const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
			try {
				const parsed = new URL(urlWithProtocol);
				// Only allow http or https schemes - reject javascript:, data:, vbscript:, etc.
				return parsed.protocol === 'http:' || parsed.protocol === 'https:';
			} catch {
				return false;
			}
		}, "URL must use http:// or https:// protocol"),
	title: z.string()
		.min(1, "Title is required")
		.max(1000, "Title must be less than 1000 characters")
		.refine((title) => !/<[^>]*>/g.test(title), "Title cannot contain HTML tags"),
	description: z.string().optional().or(z.literal("")),
	category: z.string()
		.min(1, "Category is required")
		.max(100, "Category must be less than 100 characters"),
});

export const insertSchema = z.object({
	...baseSchema.shape,
});

export const updateSchema = z.object({
	...baseSchema.shape,
	id: z.string().min(1),
});

export const deleteSchema = z.object({
	id: z.string().min(1),
});

export const bookmarkInstanceSchema = z.object({
	id: z.string().min(1),
	url: z.string()
		.min(1, "URL is required")
		.refine((url) => {
			// Add protocol if missing for validation
			const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
			try {
				const parsed = new URL(urlWithProtocol);
				// Only allow http or https schemes
				return parsed.protocol === 'http:' || parsed.protocol === 'https:';
			} catch {
				return false;
			}
		}, "URL must use http:// or https:// protocol"),
	title: z.string()
		.min(1, "Title is required")
		.refine((title) => !/<[^>]*>/g.test(title), "Title cannot contain HTML tags"),
	favicon: z.string().optional(),
	description: z.string().optional().or(z.literal("")),
	category: z.string().min(1),
	createdAt: z.string().regex(isoDateRegex, "Invalid date format"),
	updatedAt: z.string().regex(isoDateRegex, "Invalid date format"),
});

export type InsertSchema = z.infer<typeof insertSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
export type DeleteSchema = z.infer<typeof deleteSchema>;
export type BookmarkInstanceSchema = z.infer<typeof bookmarkInstanceSchema>;
