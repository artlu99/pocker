import { ChevronLeft, ChevronRight, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BookmarkInstance, BookmarksData } from "../lib/types";
import { cn } from "../lib/utils";

interface FloatingNavProps {
	categories: string[];
	bookmarksData: BookmarksData | null;
}

export function FloatingNav({ categories, bookmarksData }: FloatingNavProps) {
	const { t } = useTranslation();
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	// 过滤空分类和没有书签的分类
	const validCategories = categories.filter((cat) => {
		// 过滤空分类名
		if (cat.trim() === "") return false;

		// 过滤没有书签的分类
		if (!bookmarksData || !bookmarksData.bookmarks) return false;
		const categoryBookmarks = bookmarksData.bookmarks.filter(
			(b: BookmarkInstance) => b.category === cat,
		);
		return categoryBookmarks.length > 0;
	});

	// 检测移动设备
	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		// 初始检查
		checkIsMobile();

		// 监听窗口大小变化
		window.addEventListener("resize", checkIsMobile);

		return () => {
			window.removeEventListener("resize", checkIsMobile);
		};
	}, []);

	// 监听滚动，确定当前活跃的分类
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 200; // 添加一点偏移以提高用户体验

			if (window.scrollY > 100) {
				setHasScrolled(true);
			} else {
				setHasScrolled(false);
			}

			// 查找当前滚动位置对应的分类
			let foundActive = false;

			for (const category of validCategories) {
				const element = document.getElementById(`category-${category}`);
				if (element) {
					const { offsetTop, offsetHeight } = element;
					if (
						scrollPosition >= offsetTop &&
						scrollPosition < offsetTop + offsetHeight
					) {
						setActiveCategory(category);
						foundActive = true;
						break;
					}
				}
			}

			// 如果没有找到活跃分类，但页面已滚动且有分类，则选择第一个分类
			if (!foundActive && hasScrolled && validCategories.length > 0) {
				// 检查是否滚动超过了第一个分类
				const firstCategoryEl = document.getElementById(
					`category-${validCategories[0]}`,
				);
				if (firstCategoryEl && scrollPosition >= firstCategoryEl.offsetTop) {
					setActiveCategory(validCategories[0]);
				}
			}

			// 如果滚动到页面顶部，取消活跃分类
			if (window.scrollY < 100) {
				setActiveCategory(null);
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // 初始化时调用一次

		// 设置组件可见
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 300);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			clearTimeout(timer);
		};
	}, [validCategories, hasScrolled]);

	// 如果没有有效分类或在移动设备上，不显示导航
	if (validCategories.length === 0 || isMobile) return null;

	return (
		<div
			className={cn(
				"fixed right-0 top-1/3 transform -translate-y-1/3 z-50 transition-all duration-500 ease-in-out hidden lg:block",
				isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5",
				!hasScrolled && "pointer-events-none opacity-0",
				isCollapsed ? "w-12" : "w-48",
			)}
		>
			<div
				className={cn(
					"bg-blue-50/90 backdrop-blur-xs border border-blue-100 rounded-l-xl shadow-md transition-all duration-300 overflow-hidden",
					isCollapsed ? "w-12" : "w-48",
				)}
			>
				{/* 标题栏同时作为折叠/展开按钮 */}
				<button
					type="button"
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="w-full flex items-center gap-2 px-3 py-3 border-b border-blue-100/50 text-blue-600 hover:bg-blue-100/50 transition-colors text-left"
					aria-label={
						isCollapsed
							? t("Components.FloatingNav.expandNav")
							: t("collapseNav")
					}
				>
					<Folder className="h-4 w-4 shrink-0" />
					{!isCollapsed && (
						<>
							<span className="text-sm font-medium whitespace-nowrap">
								{t("Components.FloatingNav.title")}
							</span>
							<ChevronLeft className="h-4 w-4 ml-auto" />
						</>
					)}
				</button>

				{/* 导航列表 */}
				<div className={cn("py-2", isCollapsed ? "px-1" : "px-2")}>
					<ul className={cn("space-y-1")}>
						{validCategories.map((category) => (
							<li key={category}>
								<a
									href={`#category-${category}`}
									className={cn(
										"flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group",
										activeCategory === category
											? "bg-blue-100 text-blue-600"
											: "text-slate-500 hover:bg-blue-50 hover:text-blue-600",
										isCollapsed ? "justify-center px-2" : "",
									)}
									onClick={(e) => {
										e.preventDefault();
										document
											.getElementById(`category-${category}`)
											?.scrollIntoView({ behavior: "smooth" });
										setActiveCategory(category);
									}}
									aria-label={t("Components.FloatingNav.jumpToCategory", {
										category,
									})}
								>
									{/* 指示点 */}
									<div
										className={cn(
											"shrink-0 rounded-full transition-all duration-200",
											activeCategory === category
												? "w-2 h-2 bg-blue-500"
												: "w-1.5 h-1.5 bg-slate-300 group-hover:bg-blue-300",
										)}
									/>

									{/* 分类名称 */}
									{!isCollapsed && (
										<span className="text-sm transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
											{category}
										</span>
									)}

									{/* 活跃指示箭头 */}
									{!isCollapsed && activeCategory === category && (
										<ChevronRight className="h-3 w-3 ml-auto opacity-70 shrink-0" />
									)}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
