import { useEffect, useState } from "react";
import { useSearchParams } from "wouter";
import { useTranslation } from "react-i18next";
import { CheckCircle, ExternalLink, Loader2, XCircle } from "lucide-react";
import { useCreateBookmark } from "../hooks/use-bookmarks";
import { getBaseUrl } from "../lib/utils";
import type { NonEmptyString100 } from "@evolu/common";

export const ApiAddHandler = () => {
	const { t } = useTranslation();
	const [urlParams] = useSearchParams();
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
	const [message, setMessage] = useState("");
	const [redirectUrl, setRedirectUrl] = useState("");
	const createBookmark = useCreateBookmark();

	useEffect(() => {
		const handleApiCall = async () => {
			try {
				// Parse query parameters
				const mark = urlParams.get("mark");
				const title = urlParams.get("title");
				const url = urlParams.get("url");

				// Validate required parameters
				if (!mark || !title || !url) {
					throw new Error("Missing required parameters: mark, title, or url");
				}

				// Validate URL format
				try {
					new URL(url);
				} catch {
					throw new Error("Invalid URL format");
				}

				// Create the bookmark
				createBookmark({
					mark: mark as NonEmptyString100,
					url,
					title,
					category: "uncategorized", // Default category
					description: "", // Optional description
				});

				// Set success state
				setStatus("success");
				setMessage("Bookmark added successfully!");
				setRedirectUrl(`${getBaseUrl()}/${mark}`);

				// Auto-redirect after 3 seconds
				setTimeout(() => {
					window.location.href = `${getBaseUrl()}/${mark}`;
				}, 3000);

			} catch (error) {
				console.error("Failed to add bookmark:", error);
				setStatus("error");
				setMessage(error instanceof Error ? error.message : "Failed to add bookmark");
			}
		};

		handleApiCall();
	}, [createBookmark, urlParams]);

	const getStatusIcon = () => {
		switch (status) {
			case "loading":
				return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
			case "success":
				return <CheckCircle className="h-8 w-8 text-green-500" />;
			case "error":
				return <XCircle className="h-8 w-8 text-red-500" />;
		}
	};

	const getStatusColor = () => {
		switch (status) {
			case "loading":
				return "text-blue-600";
			case "success":
				return "text-green-600";
			case "error":
				return "text-red-600";
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-slate-900 dark:to-purple-950">
			<div className="max-w-md w-full mx-4">
				<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 text-center">
					<div className="flex justify-center mb-6">
						{getStatusIcon()}
					</div>
					
					<h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
						{status === "loading" && t("BookmarkDialog.adding")}
						{status === "success" && t("BookmarkDialog.addSuccess")}
						{status === "error" && t("BookmarkDialog.addFailed")}
					</h1>
					
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						{message}
					</p>

					{status === "success" && redirectUrl && (
						<div className="space-y-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{t("BookmarkDialog.redirecting")}
							</p>
							<a
								href={redirectUrl}
								className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
							>
								<ExternalLink className="h-4 w-4" />
								{t("BookmarkDialog.viewBookmarks")}
							</a>
						</div>
					)}

					{status === "error" && (
						<div className="space-y-4">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{t("BookmarkDialog.errors.invalidUrl")}
							</p>
							<button
								type="button"
								onClick={() => window.close()}
								className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
							>
								{t("BookmarkDialog.close")}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
