import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "../components/ui/card";
import type { BookmarkInstance } from "../lib/types";
import { getDomain, addUrlProtocol } from "../lib/utils";
import { DialogDelete } from "./dialog-delete";
import { DialogEdit } from "./dialog-edit";

interface BookmarkCardProps {
	bookmark: BookmarkInstance;
	categories: string[];
	onBookmarkUpdated: (bookmark: BookmarkInstance) => void;
	onBookmarkDeleted: () => void;
}

export const BookmarkCard = memo(function BookmarkCard({
	bookmark,
	categories,
	onBookmarkUpdated,
	onBookmarkDeleted,
}: BookmarkCardProps) {
	const { t } = useTranslation();
	const { url, title, favicon, createdAt, category, description } = bookmark;

	// Restore URL protocol for display and navigation
	const displayUrl = addUrlProtocol(url);

	const formattedDate = (() => {
		try {
			return formatDistanceToNow(new Date(createdAt), {
				addSuffix: true,
			});
		} catch (error) {
			console.warn("Invalid date format:", createdAt);
			return "recently";
		}
	})();

	const domain = getDomain(displayUrl);

	return (
		<>
			<Card className="h-[220px] w-full flex flex-col overflow-hidden transition-all hover:shadow-md backdrop-blur-xs bg-card/50 border border-border/60">
				<CardHeader className="p-4 pb-2 flex flex-row items-center gap-2 shrink-0">
					{favicon ? (
						<div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
							<div className="absolute inset-0 bg-blue-500/5 rounded-md" />
							<img
								src={favicon || `https://favicone.com/${domain}?s=32`}
								alt={`${title} favicon`}
								className="w-6 h-6 rounded-sm relative z-10"
								loading="lazy"
								width="24"
								height="24"
								onError={(e) => {
									// If favicon fails to load, replace with a default icon
									(e.target as HTMLImageElement).src =
										"/placeholder.svg?height=20&width=20";
								}}
							/>
						</div>
					) : (
						<div className="w-8 h-8 shrink-0 bg-blue-500/5 rounded-md flex items-center justify-center">
							<ExternalLink className="w-4 h-4 text-blue-500/70" />
						</div>
					)}
					<div className="flex-1 truncate">
						<h3 className="font-medium text-sm truncate" title={title}>
							{title}
						</h3>
						<p
							className="text-xs text-muted-foreground truncate"
							title={displayUrl}
						>
							{domain}
						</p>
					</div>
				</CardHeader>
				<CardContent className="p-4 grow overflow-hidden flex flex-col">
					{description ? (
						<p
							className="text-sm text-muted-foreground mb-3 line-clamp-2 shrink-0"
							title={description}
						>
							{description}
						</p>
					) : (
						<div className="grow" />
					)}
					<div className="flex items-center justify-between mt-auto shrink-0">
						<Badge
							variant="outline"
							className="text-xs bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-300 truncate max-w-[60%]"
						>
							{category}
						</Badge>
						<span className="text-xs text-muted-foreground">
							{formattedDate}
						</span>
					</div>
				</CardContent>
				<CardFooter className="p-4 pt-0 flex justify-between shrink-0">
					<div className="w-full mr-2 hover-scale-sm">
						<Button
							variant="outline"
							size="sm"
							className="w-full border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10"
							onClick={() => window.open(displayUrl, "_blank")}
						>
							<ExternalLink className="h-3 w-3 mr-2" />
							{t("Components.BookmarkCard.visit")}
						</Button>
					</div>
					<div className="flex space-x-2 shrink-0">
						<div className="hover-scale">
							<DialogEdit
								bookmark={bookmark}
								categories={categories}
								onBookmarkUpdated={onBookmarkUpdated}
							/>
						</div>
						<div className="hover-scale">
							<DialogDelete
								bookmark={bookmark}
								onBookmarkDeleted={onBookmarkDeleted}
							/>
						</div>
					</div>
				</CardFooter>
			</Card>
		</>
	);
});
