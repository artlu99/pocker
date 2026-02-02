import { zodResolver } from "@hookform/resolvers/zod";
import {
	Edit2,
	FileText,
	Link,
	Loader2,
	Pencil,
	Plus,
	Tag,
	CheckCircle,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useUpdateBookmark } from "../hooks/use-bookmarks";
import { type UpdateSchema, updateSchema } from "../lib/schema";
import type { BookmarkInstance } from "../lib/types";
import { addUrlProtocol } from "../lib/utils";
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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useToast } from "./toast-provider";

interface DialogEditProps {
	bookmark: BookmarkInstance;
	categories: string[];
	onBookmarkUpdated: (bookmark: BookmarkInstance) => void;
}

export function DialogEdit({
	bookmark,
	categories,
	onBookmarkUpdated,
}: DialogEditProps) {
	const { t } = useTranslation();
	const { showToast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);
	const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [error, setError] = useState<string | null>(null);
	const updateBookmark = useUpdateBookmark();

	const form = useForm<UpdateSchema>({
		resolver: zodResolver(updateSchema),
		defaultValues: {
			id: bookmark.id,
			url: addUrlProtocol(bookmark.url), // Restore protocol for display
			title: bookmark.title,
			description: bookmark.description || "",
			category: bookmark.category,
		},
	});

	// Track form changes
	const {
		formState: { isDirty },
	} = form;

	// Reset error when dialog opens/closes
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setError(null);
			setIsSubmitting(false);
		}
	};

	const performCategoryUpdate = (categoryValue: string) => {
		const values = form.getValues();
		const payload = {
			...bookmark,
			url: values.url,
			title: values.title,
			description: values.description ?? "",
			category: categoryValue,
		};
		const updated = updateBookmark(payload);
		showToast({
			title: t("Components.BookmarkDialog.updateSuccess"),
			description: t("Components.BookmarkDialog.updateSuccessDescription"),
			variant: "success",
		});
		onBookmarkUpdated(updated);
	};

	const handleCategoryChange = (value: string) => {
		if (value === "new_category") {
			setIsCreatingNewCategory(true);
			form.setValue("category", "");
		} else {
			setIsCreatingNewCategory(false);
			form.setValue("category", value);
			// Save immediately when user picks an existing category
			setIsSubmitting(true);
			setError(null);
			try {
				performCategoryUpdate(value);
			} catch (err) {
				console.error("Failed to update category:", err);
				const msg =
					err instanceof Error
						? err.message
						: t("Components.BookmarkDialog.updateError");
				setError(msg);
				showToast({
					title: t("Components.BookmarkDialog.updateError"),
					description: msg,
					variant: "error",
				});
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewCategory(value);
		form.setValue("category", value, { shouldDirty: true });
	};

	const onSubmit = async (data: UpdateSchema) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const categoryValue = isCreatingNewCategory ? newCategory : data.category;
			const updatedBookmark = updateBookmark({
				...bookmark,
				...data,
				category: categoryValue,
			});

			// Show success feedback
			showToast({
				title: t("Components.BookmarkDialog.updateSuccess"),
				description: t("Components.BookmarkDialog.updateSuccessDescription"),
				variant: "success",
			});

			onBookmarkUpdated(updatedBookmark);

			// Close dialog after a brief delay to show success state
			setTimeout(() => {
				setOpen(false);
			}, 500);
		} catch (error) {
			console.error("Failed to update bookmark:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: t("Components.BookmarkDialog.updateError");
			setError(errorMessage);

			// Show error toast
			showToast({
				title: t("Components.BookmarkDialog.updateError"),
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
					className="border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10"
				>
					<Edit2 className="h-3 w-3" />
					<span className="sr-only">{t("Components.BookmarkDialog.edit")}</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="dialog-content sm:max-w-[425px] border border-blue-500/20 bg-card/95 backdrop-blur-xs">
				<DialogHeader>
					<DialogTitle className="text-xl flex items-center gap-2">
						<span className="bg-blue-500/10 p-1.5 rounded-md">
							<Pencil className="h-4 w-4 text-blue-500" />
						</span>
						{t("Components.BookmarkDialog.editTitle")}
					</DialogTitle>
					<DialogDescription>
						{t("Components.BookmarkDialog.editDescription")}
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
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-1.5">
										<Link className="h-3.5 w-3.5 text-blue-500" />
										{t("Components.BookmarkDialog.url")}
									</FormLabel>
									<FormControl>
										<Input
											placeholder={t(
												"Components.BookmarkDialog.urlPlaceholder",
											)}
											className="border-blue-500/20 focus:border-blue-500/40 bg-blue-500/5 focus:ring-blue-500/10"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{t("Components.BookmarkDialog.urlDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-1.5">
										<FileText className="h-3.5 w-3.5 text-indigo-500" />
										{t("Components.BookmarkDialog.title")}
									</FormLabel>
									<FormControl>
										<Input
											placeholder={t(
												"Components.BookmarkDialog.titlePlaceholder",
											)}
											className="border-indigo-500/20 focus:border-indigo-500/40 bg-indigo-500/5 focus:ring-indigo-500/10"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{t("Components.BookmarkDialog.titleDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-1.5">
										<FileText className="h-3.5 w-3.5 text-purple-500" />
										{t("Components.BookmarkDialog.description")}
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={t(
												"Components.BookmarkDialog.descriptionPlaceholder",
											)}
											className="border-purple-500/20 focus:border-purple-500/40 bg-purple-500/5 focus:ring-purple-500/10"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										{t("Components.BookmarkDialog.descriptionDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-1.5">
										<Tag className="h-3.5 w-3.5 text-green-500" />
										{t("Components.BookmarkDialog.category")}
									</FormLabel>
									{!isCreatingNewCategory ? (
										<div className="space-y-2">
											<div className="flex gap-2">
												<Select
													onValueChange={handleCategoryChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="border-green-500/20 focus:border-green-500/40 bg-green-500/5 focus:ring-green-500/10">
															<SelectValue
																placeholder={t(
																	"Components.BookmarkDialog.categoryPlaceholder",
																)}
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{categories.map((category) => (
															<SelectItem key={category} value={category}>
																{category}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<Button
													type="button"
													variant="outline"
													size="icon"
													onClick={() => setIsCreatingNewCategory(true)}
													className="h-9 w-9 border-green-500/20 hover:bg-green-500/10"
													title={t("Components.BookmarkDialog.newCategory")}
												>
													<Plus className="h-4 w-4 text-green-500" />
												</Button>
											</div>
										</div>
									) : (
										<div className="flex gap-2">
											<FormControl>
												<Input
													value={newCategory}
													onChange={handleNewCategoryChange}
													placeholder={t(
														"Components.BookmarkDialog.newCategoryPlaceholder",
													)}
													className="border-green-500/20 focus:border-green-500/40 bg-green-500/5 focus:ring-green-500/10"
													autoFocus
												/>
											</FormControl>
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() => setIsCreatingNewCategory(false)}
												className="h-9 w-9 border-green-500/20 hover:bg-green-500/10"
												title={t("Components.BookmarkDialog.backToCategories")}
											>
												<Tag className="h-4 w-4 text-green-500" />
											</Button>
										</div>
									)}
									<FormDescription>
										{t("Components.BookmarkDialog.categoryDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="gap-2 sm:gap-0">
							<DialogClose asChild>
								<Button type="button" variant="outline">
									{t("Components.BookmarkDialog.cancel")}
								</Button>
							</DialogClose>
							<div className="hover-scale-sm">
								<Button
									type="submit"
									disabled={isSubmitting || !isDirty}
									className="bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{t("Components.BookmarkDialog.updating")}
										</>
									) : (
										<>
											<CheckCircle className="mr-2 h-4 w-4" />
											{t("Components.BookmarkDialog.updateButton")}
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
