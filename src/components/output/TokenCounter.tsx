// Token 估算组件占位（EN: TokenCounter placeholder component）
// TODO: 后续实现 token 粗略估算展示（TODO: implement token estimation UI）

import type React from "react";
import { memo } from "react";

export type TokenCounterProps = {
	estimatedTokens?: number;
	className?: string;
};

export const TokenCounter: React.FC<TokenCounterProps> = memo(
	({ estimatedTokens, className }) => {
		return (
			<div
				className={className ?? ""}
				data-testid="token-counter"
			>
				{estimatedTokens ?? 0} tokens
			</div>
		);
	},
);

TokenCounter.displayName = "TokenCounter";

