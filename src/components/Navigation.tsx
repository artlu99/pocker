import { CloudDownload, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Link } from "wouter";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "./ui/button";

export function Navigation() {
	const { t } = useTranslation();

	return (
		<nav className="ml-auto flex gap-2 sm:gap-4 items-center">
			<Link
				href="/doc"
				className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-200"
			>
				<FileText className="h-4 w-4" />
				<span className="hidden sm:inline">{t("Navigation.quickstart")}</span>
			</Link>

			<Link
				href="/sync"
				className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-200"
			>
				<CloudDownload className="h-4 w-4" />
				<span className="hidden sm:inline">{t("Navigation.sync")}</span>
			</Link>

			<Button variant="ghost" asChild>
				<a
					href="https://github.com/artlu99/pocker"
					target="_blank"
					rel="noopener noreferrer"
				>
					<SiGithub className="h-4 w-4" />
					<span className="hidden sm:inline">{t("Navigation.github")}</span>
				</a>
			</Button>

			<LanguageSwitcher />
		</nav>
	);
}
