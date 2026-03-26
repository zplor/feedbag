import { useEffect, useState } from "react";
import { FeedbagConfigProvider } from "~/components";

export interface InitializationSuspenseProps {
	children: React.ReactNode;
}

export function InitializationSuspense({
	children,
}: InitializationSuspenseProps) {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		onLoad();
	}, []);

	const onLoad = async () => {
		try {
			setIsInitialized(true);
			// Hide loading - safe to call during prerendering
			(window as any).__FEEDBAG_HIDE_LOADING__?.();
		} catch (error) {
			console.log("Failed to initialize prerender:", error);
		}
	};

	return (
		<FeedbagConfigProvider>
			{isInitialized ? children : <div>loading··············</div>}
		</FeedbagConfigProvider>
	);
}
