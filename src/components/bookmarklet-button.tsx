import { BookmarkPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookmarkletButtonProps {
	baseUrl: string;
}

export function BookmarkletButton({ baseUrl }: BookmarkletButtonProps) {
	const { t } = useTranslation();

	const bookmarkletCode = `javascript:(function(){u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);window.open('${baseUrl}/api/add?title='+t+'&url='+u, '_blank').focus()})()`;

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("text/uri-list", bookmarkletCode);
		e.dataTransfer.setData("text/plain", bookmarkletCode);
		e.dataTransfer.effectAllowed = "link";
	};

	return (
		<div className=" hover-scale">
			<button
				type="button"
				draggable={true}
				onDragStart={handleDragStart}
				onClick={(e) => e.preventDefault()}
				className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-foreground h-9 px-4 py-2 select-all cursor-move shadow-xs hover:shadow-md"
				title={t("BookmarksPage.bookmarkletTip")}
			>
				<BookmarkPlus className="h-4 w-4 mr-2 text-blue-500" />
				{t("BookmarksPage.saveButton")}
			</button>
		</div>
	);
}
