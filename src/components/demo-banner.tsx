import { Link } from "wouter";
import { isDemoMark } from "../lib/utils";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export function DemoBanner({ mark }: { mark: string }) {
	const { t } = useTranslation();
	if (!isDemoMark(mark)) {
		return null;
	}
	return (
		<div className="demo-banner mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 backdrop-blur-xs p-4 shadow-xs">
			<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
				<div className="flex items-center gap-2 text-amber-600 font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-5 w-5"
					>
						<path d="M12 9v4" />
						<path d="M12 16h.01" />
						<path d="M3.8 9.7a8 8 0 0 0 0 4.6" />
						<path d="M20.2 9.7a8 8 0 0 1 0 4.6" />
						<path d="M8 3.6a8 8 0 0 1 8 0" />
						<path d="M8 20.4a8 8 0 0 0 8 0" />
						<path d="m18.7 14.4-.9-.1" />
						<path d="m6.2 9.7-.9.1" />
						<path d="m14.4 5.3-.1.9" />
						<path d="m9.7 17.8-.1.9" />
						<path d="m14.4 18.7.1.9" />
						<path d="m9.7 5.3-.1-.9" />
						<path d="m17.8 9.7.9-.1" />
						<path d="m5.3 14.4.9.1" />
						<title>Demo Mode</title>
					</svg>
					<span>{t("BookmarksPage.demoMode")}</span>
				</div>
				<p className="text-muted-foreground text-sm flex-1">
					{t("BookmarksPage.demoDescription")}
				</p>
				<Link to="/doc">
					<Button
						variant="outline"
						size="sm"
						className="border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700"
					>
						{t("BookmarksPage.createOwn")}
					</Button>
				</Link>
			</div>
		</div>
	);
}
