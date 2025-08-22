import { EvoluProvider } from "@evolu/react";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import App from "./App.tsx";
import { ToastProvider } from "./components/toast-provider.tsx";
import en from "./i18n/en.json";
import es from "./i18n/es.json";
import zh from "./i18n/zh.json";
import "./index.css";
import { evoluInstance } from "./lib/evolu";

const resources = {
	en: { translation: en },
	es: { translation: es },
	zh: { translation: zh },
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",

		interpolation: {
			escapeValue: false, // react already safes from xss
		},

		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
	});

const root = document.getElementById("root");
if (!root) throw new Error("root not found");

createRoot(root).render(
	<StrictMode>
		<EvoluProvider value={evoluInstance}>
			<ToastProvider>
				<App />
			</ToastProvider>
		</EvoluProvider>
	</StrictMode>,
);
