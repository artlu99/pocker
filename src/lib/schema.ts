import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export const baseSchema = z.object({
	url: z.string()
		.min(1, "URL is required")
		.refine((url) => {
			// Allow URLs with or without protocol
			const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
			try {
				new URL(urlWithProtocol);
				return true;
			} catch {
				return false;
			}
		}, "Please enter a valid URL"),
	title: z.string().min(1),
	description: z.string().optional().or(z.literal("")),
	category: z.string().min(1),
});

export const insertSchema = z.object({
	...baseSchema.shape,
	mark: z.string().min(1).max(100),
});

export const updateSchema = z.object({
	...baseSchema.shape,
	mark: z.string().min(1),
	id: z.string().min(1),
});

export const deleteSchema = z.object({
	mark: z.string().min(1),
	id: z.string().min(1),
});

export const bookmarkInstanceSchema = z.object({
	id: z.string().min(1),
	url: z.string()
		.min(1, "URL is required")
		.refine((url) => {
			// Allow URLs with or without protocol
			const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
			try {
				new URL(urlWithProtocol);
				return true;
			} catch {
				return false;
			}
		}, "Please enter a valid URL"),
	title: z.string().min(1),
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
