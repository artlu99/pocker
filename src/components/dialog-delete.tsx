import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type DeleteSchema, deleteSchema } from "../../shared/schema";
import type { BookmarkInstance } from "../../shared/types";
import { useDeleteBookmark } from "../hooks/use-bookmarks";
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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);
	const deleteBookmark = useDeleteBookmark();

	const form = useForm<DeleteSchema>({
		resolver: zodResolver(deleteSchema),
		defaultValues: {
			mark,
			uuid: bookmark.uuid,
		},
	});

	const onSubmit = async (data: DeleteSchema) => {
		setIsSubmitting(true);
		try {
			await deleteBookmark.mutateAsync({ mark: data.mark, uuid: data.uuid });
			setOpen(false);
			onBookmarkDeleted();
		} catch (error) {
			console.error("Failed to delete bookmark:", error);
			if (error instanceof Error) {
				console.error("Error details:", {
					message: error.message,
					stack: error.stack,
				});
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{t("Components.BookmarkDialog.deleteButton")}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
