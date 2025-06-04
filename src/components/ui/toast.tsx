import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
	{
		variants: {
			variant: {
				default: "border bg-background text-foreground",
				success:
					"border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
				error: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
				warning:
					"border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
				info: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface ToastProps extends VariantProps<typeof toastVariants> {
	visible: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	duration?: number;
	className?: string;
}

export function Toast({
	visible,
	onClose,
	title,
	description,
	variant,
	duration = 8000,
	className,
}: ToastProps) {
	// 使用 ref 跟踪定时器
	const timerRef = React.useRef<NodeJS.Timeout | null>(null);
	const [isExiting, setIsExiting] = React.useState(false);
	const [shouldRender, setShouldRender] = React.useState(visible);

	// 处理关闭动画和实际关闭
	const handleClose = React.useCallback(() => {
		setIsExiting(true);
		// 等待动画完成后再移除元素
		setTimeout(() => {
			setIsExiting(false);
			onClose();
			setShouldRender(false);
		}, 200); // 匹配 CSS 动画时间
	}, [onClose]);

	// 清除之前的定时器
	React.useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (visible) {
			setShouldRender(true);
			setIsExiting(false);
			timerRef.current = setTimeout(() => {
				handleClose();
			}, duration);
		} else if (!visible && !isExiting) {
			setShouldRender(false);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [visible, duration, handleClose, isExiting]);

	if (!shouldRender && !visible) {
		return null;
	}

	return (
		<div
			className={cn(
				toastVariants({ variant }),
				"fixed top-4 right-4 z-50 max-w-md",
				isExiting ? "fade-out-up" : "fade-in-down",
				className,
			)}
		>
			<div className="flex-1">
				{title && <div className="font-medium">{title}</div>}
				{description && <div className="text-sm opacity-90">{description}</div>}
			</div>
			<button
				type="button"
				onClick={handleClose}
				className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-2 group-hover:opacity-100"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
