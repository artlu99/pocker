import { zodResolver } from "@hookform/resolvers/zod";
import {
	FileText,
	Link,
	Loader2,
	Plus,
	PlusCircle,
	Tag,
	CheckCircle,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreateBookmark } from "../hooks/use-bookmarks";
import { type InsertSchema, insertSchema } from "../lib/schema";
import type { BookmarkInstance, NonEmptyString100 } from "../lib/types";
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

interface DialogCreateProps {
	mark: string;
	categories: string[];
	onBookmarkAdded: (bookmark: BookmarkInstance) => void;
}

export function DialogAdd({
	mark,
	categories,
	onBookmarkAdded,
}: DialogCreateProps) {
	const { t } = useTranslation();
	const { showToast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);
	const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [error, setError] = useState<string | null>(null);
	const createBookmark = useCreateBookmark();

	const form = useForm<InsertSchema>({
		resolver: zodResolver(insertSchema),
		defaultValues: {
			mark,
			url: "",
			title: "",
			description: "",
			category: categories[0] || "",
		},
	});

	// Reset error and form when dialog opens/closes
	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setError(null);
			setIsSubmitting(false);
			form.reset();
		}
	};

	const handleCategoryChange = (value: string) => {
		if (value === "new_category") {
			setIsCreatingNewCategory(true);
			form.setValue("category", "");
		} else {
			setIsCreatingNewCategory(false);
			form.setValue("category", value);
		}
	};

	const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewCategory(value);
		form.setValue("category", value);
	};

	const onSubmit = async (data: InsertSchema) => {
		setIsSubmitting(true);
		setError(null);
		
		try {
			const categoryValue = isCreatingNewCategory ? newCategory : data.category;
			const bookmark = createBookmark({
				...data,
				mark: data.mark as NonEmptyString100,
				category: categoryValue,
			});
			
			// Show success feedback
			showToast({
				title: t("Components.BookmarkDialog.addSuccess"),
				description: t("Components.BookmarkDialog.addSuccessDescription"),
				variant: "success",
			});
			
			onBookmarkAdded(bookmark);
			form.reset();
			
			// Close dialog after a brief delay to show success state
			setTimeout(() => {
				setOpen(false);
			}, 500);
			
		} catch (error) {
			console.error("Failed to create bookmark:", error);
			const errorMessage = error instanceof Error 
				? error.message 
				: t("Components.BookmarkDialog.addError");
			setError(errorMessage);
			
			// Show error toast
			showToast({
				title: t("Components.BookmarkDialog.addError"),
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
					className="border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10"
				>
					<Plus className="h-3.5 w-3.5 mr-2" />
					{t("Components.BookmarkDialog.addBookmark")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PlusCircle className="h-5 w-5 text-blue-500" />
						{t("Components.BookmarkDialog.addTitle")}
					</DialogTitle>
					<DialogDescription>
						{t("Components.BookmarkDialog.addDescription")}
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
											placeholder={t("Components.BookmarkDialog.urlPlaceholder")}
											className="border-blue-500/20 focus:border-blue-500/40 bg-blue-500/5 focus:ring-blue-500/10"
											{...field}
										/>
									</FormControl>
									<FormDescription>{t("Components.BookmarkDialog.urlDescription")}</FormDescription>
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
									disabled={isSubmitting}
									className="bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{t("Components.BookmarkDialog.adding")}
										</>
									) : (
										<>
											<CheckCircle className="mr-2 h-4 w-4" />
											{t("Components.BookmarkDialog.addButton")}
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
