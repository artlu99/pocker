import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDeleteBookmark } from "../hooks/use-bookmarks";
import { type DeleteSchema, deleteSchema } from "../lib/schema";
import type { BookmarkInstance } from "../lib/types";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Form, FormDescription } from "./ui/form";
import { useToast } from "./toast-provider";

interface DialogDeleteProps {
	mark: string;
	bookmark: BookmarkInstance;
	onBookmarkDeleted: () => void;
}

export function DialogDelete({
	mark,
	bookmark,
	onBookmarkDeleted,
}: DialogDeleteProps) {
	const { t } = useTranslation();
	const { showToast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const deleteBookmark = useDeleteBookmark();

	const form = useForm<DeleteSchema>({
		resolver: zodResolver(deleteSchema),
		defaultValues: {
			mark,
			id: bookmark.id,
		},
	});

	// Reset error when dialog opens/closes
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setError(null);
			setIsSubmitting(false);
		}
	};

	const onSubmit = async (data: DeleteSchema) => {
		setIsSubmitting(true);
		setError(null);

		try {
			deleteBookmark({ mark: data.mark, id: data.id });

			// Show success feedback
			showToast({
				title: t("Components.BookmarkDialog.deleteSuccess"),
				description: t("Components.BookmarkDialog.deleteSuccessDescription"),
				variant: "success",
			});

			onBookmarkDeleted();

			// Close dialog after a brief delay to show success state
			setTimeout(() => {
				setOpen(false);
			}, 500);
		} catch (error) {
			console.error("Failed to delete bookmark:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: t("Components.BookmarkDialog.deleteError");
			setError(errorMessage);

			// Show error toast
			showToast({
				title: t("Components.BookmarkDialog.deleteError"),
				description: errorMessage,
				variant: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-500/80 hover:text-red-500"
				>
					<Trash2 className="h-3 w-3" />
					<span className="sr-only">
						{t("Components.BookmarkDialog.delete")}
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="dialog-content sm:max-w-[425px] border border-red-500/20 bg-card/95 backdrop-blur-xs">
				<DialogHeader>
					<DialogTitle className="text-xl flex items-center gap-2">
						<span className="bg-red-500/10 p-1.5 rounded-md">
							<Trash2 className="h-4 w-4 text-red-500" />
						</span>
						{t("Components.BookmarkDialog.deleteTitle")}
					</DialogTitle>
					<DialogDescription>
						{t("Components.BookmarkDialog.deleteDescription", {
							title: bookmark.title,
						})}
					</DialogDescription>
				</DialogHeader>

				{/* Error Display */}
				{error && (
					<div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 dark:text-red-400">
						<XCircle className="h-4 w-4 flex-shrink-0" />
						<span className="text-sm">{error}</span>
					</div>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 pt-4"
					>
						<FormDescription className="text-center text-muted-foreground">
							{t("Components.BookmarkDialog.deleteConfirmation")}
						</FormDescription>

						<DialogFooter className="gap-2 sm:gap-0">
							<DialogClose asChild>
								<Button type="button" variant="outline">
									{t("Components.BookmarkDialog.cancel")}
								</Button>
							</DialogClose>
							<div className="hover-scale-sm">
								<Button
									type="submit"
									disabled={isSubmitting}
									variant="destructive"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{t("Components.BookmarkDialog.deleting")}
										</>
									) : (
										<>
											<CheckCircle className="mr-2 h-4 w-4" />
											{t("Components.BookmarkDialog.deleteButton")}
										</>
									)}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
