import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Link, Loader2, Plus, PlusCircle, Tag } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type InsertSchema, insertSchema } from "../../shared/schema";
import type { BookmarkInstance } from "../../shared/types";
import { useCreateBookmark } from "../hooks/use-bookmarks";
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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [open, setOpen] = useState(false);
	const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
	const [newCategory, setNewCategory] = useState("");
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
		try {
			const categoryValue = isCreatingNewCategory ? newCategory : data.category;
			const bookmark = await createBookmark.mutateAsync({
				...data,
				category: categoryValue,
			});
			onBookmarkAdded(bookmark);
			form.reset();
			setOpen(false);
		} catch (error) {
			console.error("Failed to create bookmark:", error);
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
											placeholder={t("urlPlaceholder")}
											className="border-blue-500/20 focus:border-blue-500/40 bg-blue-500/5 focus:ring-blue-500/10"
											{...field}
										/>
									</FormControl>
									<FormDescription>{t("urlDescription")}</FormDescription>
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
											className="border-purple-500/20 focus:border-purple-500/40 bg-purple-500/5 focus:ring-purple-500/10 min-h-[80px]"
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
									<FormControl>
										{isCreatingNewCategory ? (
											<Input
												placeholder={t(
													"Components.BookmarkDialog.newCategoryPlaceholder",
												)}
												className="border-green-500/20 focus:border-green-500/40 bg-green-500/5 focus:ring-green-500/10"
												value={newCategory}
												onChange={handleNewCategoryChange}
											/>
										) : (
											<Select
												value={field.value}
												onValueChange={handleCategoryChange}
											>
												<SelectTrigger className="border-green-500/20 focus:border-green-500/40 bg-green-500/5 focus:ring-green-500/10">
													<SelectValue
														placeholder={t(
															"Components.BookmarkDialog.categoryPlaceholder",
														)}
													/>
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem key={category} value={category}>
															{category}
														</SelectItem>
													))}
													<SelectItem value="new_category">
														<Plus className="h-3.5 w-3.5 mr-2" />
														{t("Components.BookmarkDialog.newCategory")}
													</SelectItem>
												</SelectContent>
											</Select>
										)}
									</FormControl>
									<FormDescription>
										{t("Components.BookmarkDialog.categoryDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									className="border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10"
								>
									{t("Components.BookmarkDialog.cancel")}
								</Button>
							</DialogClose>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
										{t("Components.BookmarkDialog.adding")}
									</>
								) : (
									<>
										<Plus className="h-3.5 w-3.5 mr-2" />
										{t("Components.BookmarkDialog.addButton")}
									</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
