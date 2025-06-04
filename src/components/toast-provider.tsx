import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { Toast, type ToastProps } from "./ui/toast";

type ToastContextType = {
	showToast: (props: Omit<ToastProps, "visible" | "onClose">) => void;
	hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toast, setToast] = useState<Omit<
		ToastProps,
		"visible" | "onClose"
	> | null>(null);
	const [visible, setVisible] = useState(false);

	const showToast = useCallback(
		(props: Omit<ToastProps, "visible" | "onClose">) => {
			setToast(props);
			setVisible(true);
		},
		[],
	);

	const hideToast = useCallback(() => {
		setVisible(false);
	}, []);

	return (
		<ToastContext.Provider value={{ showToast, hideToast }}>
			{children}
			{toast && <Toast {...toast} visible={visible} onClose={hideToast} />}
		</ToastContext.Provider>
	);
}

export const useToast = () => {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
