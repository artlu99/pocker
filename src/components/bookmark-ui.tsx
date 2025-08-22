import { Layers, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import type { BookmarkInstance, BookmarksData } from "../lib/types.ts";
import { BookmarkCard } from "./bookmark-card.tsx";
import { BookmarkletButton } from "./bookmarklet-button";
import { DemoBanner } from "./demo-banner.tsx";
import { DialogAdd } from "./dialog-add.tsx";
import { ExportButton } from "./export-button.tsx";
import { FloatingNav } from "./floating-nav.tsx";
import { useToast } from "./toast-provider";

export interface BookmarkUIProps {
	mark: string;
	bookmarksData: BookmarksData | null;
	categories: string[];
	toast: { status: string; message: string } | null;
	baseUrl: string;
}

export const BookmarkUI = ({
	mark,
	bookmarksData,
	categories,
	toast,
	baseUrl,
}: BookmarkUIProps) => {
	const { t } = useTranslation();
	const { showToast } = useToast();
	const [, setLocation] = useLocation();
	const [currentBookmarksData, setCurrentBookmarksData] =
		useState<BookmarksData | null>(bookmarksData);

	useEffect(() => {
		if (toast) {
			const variant =
				toast.status === "success"
					? "success"
					: toast.status === "error"
						? "error"
						: toast.status === "warning"
							? "warning"
							: "info";
			const message = decodeURIComponent(toast.message);
			showToast({
				title: t(toast.status),
				description: message,
				variant,
			});
		}
	}, [toast, showToast, t]);

	const refreshBookmarks = useCallback(() => {
		setLocation(`/${mark}`);
	}, [mark, setLocation]);

	const onBookmarkAdded = useCallback(
		(bookmark: BookmarkInstance) => {
			if (currentBookmarksData) {
				setCurrentBookmarksData({
					...currentBookmarksData,
					bookmarks: [...currentBookmarksData.bookmarks, bookmark],
				});
				refreshBookmarks();
			}
		},
		[currentBookmarksData, refreshBookmarks],
	);

	const onUpdateBookmark = useCallback(
		(bookmark: BookmarkInstance) => {
			if (currentBookmarksData) {
				setCurrentBookmarksData({
					...currentBookmarksData,
					bookmarks: currentBookmarksData.bookmarks.map((b) =>
						b.id === bookmark.id ? bookmark : b,
					),
				});
				refreshBookmarks();
			}
		},
		[currentBookmarksData, refreshBookmarks],
	);

	const onDeleteBookmark = useCallback(
		(id: string) => {
			if (currentBookmarksData) {
				setCurrentBookmarksData({
					...currentBookmarksData,
					bookmarks: currentBookmarksData.bookmarks.filter((b) => b.id !== id),
				});
				refreshBookmarks();
			}
		},
		[currentBookmarksData, refreshBookmarks],
	);

	// 过滤掉空分类
	const validCategories = categories.filter((cat) => cat.trim() !== "");

	return (
		<div className="container relative">
			{/* 悬浮导航 */}
			<FloatingNav categories={validCategories} bookmarksData={bookmarksData} />

			{/* 装饰背景元素 */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute top-0 right-0 w-160 h-160 bg-blue-500/10 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
				<div className="absolute bottom-0 left-0 w-200 h-200 bg-purple-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
				<div className="absolute bottom-1/3 right-1/4 w-120 h-120 bg-indigo-500/5 rounded-full blur-3xl" />
			</div>

			<div className="py-12 lg:py-16 scroll-smooth">
				<DemoBanner mark={mark} />

				{/* 标题区域 */}
				<div className="title-area flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
					<div>
						<div className="title-text flex items-center gap-2 mb-2">
							<h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500">
								{t("BookmarksPage.title")}
							</h1>
						</div>

						<div className="flex items-center gap-2">
							<ExportButton bookmarksData={bookmarksData} mark={mark} />

							<p className="subtitle-text text-muted-foreground">
								{t("BookmarksPage.collection", { mark })}
							</p>
						</div>

					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						<DialogAdd
							mark={mark}
							categories={categories}
							onBookmarkAdded={onBookmarkAdded}
						/>

						<div>
							<BookmarkletButton mark={mark} baseUrl={baseUrl} />
							<div className="hidden sm:flex items-center mt-1 text-xs text-muted-foreground">
								<span className="animate-pulse">↑</span>
								<span className="ml-1">{t("BookmarksPage.dragTip")}</span>
							</div>
						</div>
					</div>
				</div>

				{/* 书签列表 */}
				{bookmarksData &&
				bookmarksData.bookmarks.length > 0 &&
				validCategories.length > 0 ? (
					<div className="stagger-container space-y-8">
						{validCategories.map((category, categoryIndex) => {
							const categoryBookmarks = bookmarksData.bookmarks.filter(
								(b) => b.category === category,
							);

							if (categoryBookmarks.length === 0) return null;

							return (
								<div
									key={category}
									id={`category-${category}`}
									className={`stagger-item delay-${
										categoryIndex * 100
									} overflow-hidden scroll-mt-24`}
								>
									<div className="flex items-center gap-2 mb-4">
										<div className="flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
											<Layers className="h-4 w-4 mr-2 opacity-70" />
											<h3 className="text-md font-medium">{category}</h3>
										</div>
										<div className="text-sm text-muted-foreground">
											({categoryBookmarks.length})
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{categoryBookmarks.map((bookmark, index) => (
											<div
												key={bookmark.id}
												className={`h-full w-full delay-${(index % 9) * 100}`}
											>
												<BookmarkCard
													bookmark={bookmark}
													mark={mark}
													categories={categories}
													onBookmarkUpdated={onUpdateBookmark}
													onBookmarkDeleted={() =>
														onDeleteBookmark(bookmark.id)
													}
												/>
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="empty-state text-center py-16 px-4">
						<div className="max-w-md mx-auto">
							<div className="bg-card/50 backdrop-blur-xs border border-border/60 rounded-xl p-8 shadow-xs">
								<div className="flex justify-center mb-4">
									<div className="relative w-16 h-16 flex items-center justify-center">
										<div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md" />
										<Search className="h-8 w-8 text-muted-foreground" />
									</div>
								</div>
								<p className="text-muted-foreground text-lg mb-6">
									{t("BookmarksPage.noBookmarks")}
								</p>
								<div className="hover-scale flex justify-center">
									<DialogAdd
										mark={mark}
										categories={categories}
										onBookmarkAdded={onBookmarkAdded}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
