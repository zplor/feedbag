import type React from "react";
import { memo, useMemo } from "react";
import { useWorkspaceStore } from "~/store/workspace";
import type { OpenFile } from "~/types";

interface CodePreviewProps {
	content: string;
	filename: string;
}

const CodePreview: React.FC<CodePreviewProps> = memo(({ content }) => {
	const lines = useMemo(() => {
		return content.split("\n");
	}, [content]);

	return (
		<div className="flex-1 overflow-hidden font-mono text-[13px] leading-relaxed py-6 p-0.5 flex">
			{/* Line Numbers */}
			<div className="w-12 flex-shrink-0 overflow-auto flex flex-col text-on-surface-variant/40 select-none text-right pr-4 border-r border-white/5 mr-6">
				{lines.map((_, i) => (
					<span key={i}>{i + 1}</span>
				))}
			</div>
			{/* Code Content */}
			<div className="text-primary-fixed flex-1 whitespace-pre font-mono overflow-auto">
				{content}
			</div>
		</div>
	);
});

CodePreview.displayName = "CodePreview";

export const CodeEditor: React.FC = memo(() => {
	const { openFiles, activeFileId } = useWorkspaceStore();

	const activeFile = useMemo(() => {
		return openFiles.find((f) => f.id === activeFileId);
	}, [openFiles, activeFileId]);

	if (!activeFile) {
		return (
			<div className="flex-grow flex items-center justify-center text-on-surface-variant/50">
				<span className="text-sm">No file selected</span>
			</div>
		);
	}

	return (
		<CodePreview content={activeFile.content} filename={activeFile.name} />
	);
});

CodeEditor.displayName = "CodeEditor";
