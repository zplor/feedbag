import { ConfigProvider } from "antd";
import { useConfigProvider } from "./composables/useConfigProvider";

export function FeedbagConfigProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = useConfigProvider((state) => state.theme);
	return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
