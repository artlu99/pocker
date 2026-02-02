import { Mnemonic } from "@evolu/common";
import {
	BrushCleaningIcon,
	ClipboardIcon,
	CloudLightningIcon,
	CloudSync,
	HashIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../components/toast-provider";
import { Button } from "../components/ui/button";
import { evoluInstance, formatTypeError } from "../lib/evolu";
import "./sync.css";

export const Sync = () => {
	const { t } = useTranslation();
	const { showToast } = useToast();

	const handleCopyMnemonicClick = async () => {
		const appOwner = await evoluInstance.appOwner;
		const mnemonic: string = appOwner?.mnemonic ?? "";
		navigator.clipboard.writeText(mnemonic);
		showToast({
			variant: "success",
			title: t("SyncPage.success"),
			description: t("SyncPage.copiedMnemonic"),
		});
	};

	const handleRestoreAppOwnerClick = () => {
		const mnemonic = window.prompt(t("SyncPage.description"));
		if (mnemonic == null) return;

		const result = Mnemonic.from(mnemonic.trim());
		if (!result.ok) {
			showToast({
				variant: "error",
				title: t("SyncPage.error"),
				description: formatTypeError(result.error),
			});
			return;
		}

		void evoluInstance.restoreAppOwner(result.value);
	};

	const handleResetAppOwnerClick = () => {
		if (confirm(t("SyncPage.resetConfirm"))) {
			void evoluInstance.resetAppOwner();
			showToast({
				variant: "success",
				title: t("SyncPage.success"),
				description: t("SyncPage.resetSuccess"),
			});
		}
	};

	return (
		<div className="relative">
			{/* 装饰背景元素 */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute top-0 right-0 w-160 h-160 bg-blue-500/10 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
				<div className="absolute bottom-0 left-0 w-200 h-200 bg-purple-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
				<div className="absolute bottom-1/3 right-1/4 w-120 h-120 bg-indigo-500/5 rounded-full blur-3xl" />
			</div>

			<div className="max-w-5xl mx-auto px-4 md:px-6 my-20">
				<div className="space-y-16 mt-16">
					{/* 演示按钮 */}
					<section
						id="sync"
						className="rounded-2xl bg-linear-to-br from-purple-50/40 via-white/80 to-pink-50/40 dark:from-purple-950/20 dark:via-slate-900/30 dark:to-pink-950/20 shadow-md py-8 px-6 md:px-10 backdrop-blur-xs border border-white/20 dark:border-white/5 text-center fade-in-up delay-4 scroll-mt-16"
					>
						<div className="max-w-xl mx-auto">
							<div className="flex items-center justify-center mb-4">
								<div className="flex items-center justify-center p-2 rounded-lg bg-purple-500/10">
									<CloudSync className="h-6 w-6 text-purple-600 dark:text-purple-400" />
								</div>
							</div>

							<h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
								{t("SyncPage.title")}
								<a
									href="#sync"
									className="opacity-0 hover:opacity-100 transition-opacity"
								>
									<HashIcon className="h-4 w-4 text-muted-foreground" />
								</a>
							</h2>

							<div className="flex justify-center gap-8">
								<Button
									size="lg"
									className="gap-2 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-200"
									onClick={handleCopyMnemonicClick}
								>
									{t("SyncPage.copyMnemonic")}
									<ClipboardIcon className="h-4 w-4" />
								</Button>

								<Button
									size="lg"
									className="gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200"
									onClick={handleRestoreAppOwnerClick}
								>
									{t("SyncPage.button")}
									<CloudLightningIcon className="h-4 w-4" />
								</Button>
							</div>

							<div className="flex justify-center gap-8 mt-8">
								<Button
									size="lg"
									className="gap-2 bg-neutral-500 text-white transition-all duration-200"
									onClick={handleResetAppOwnerClick}
								>
									{t("SyncPage.resetButton")}
									<BrushCleaningIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};
