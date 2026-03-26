import type React from "react";
import { memo } from "react";
import { useWorkspaceStore } from "~/store/workspace";
import type { OpenFile } from "~/types";

export const FileTabs: React.FC = memo(() => {
	const { openFiles, activeFileId, setActiveFile, closeFile } =
		useWorkspaceStore();

	if (openFiles.length === 0) {
		return null;
	}

	return (
		<div className="flex bg-[#1b1c18] border-b border-white/5 px-2 pt-2 gap-2">
			{openFiles.map((file) => (
				<button
					key={file.id}
					type="button"
					className={`flex items-center gap-2 px-3 py-1.5 border-t-2 cursor-pointer rounded-t-lg transition-colors ${
						activeFileId === file.id
							? "bg-inverse-surface border-[#8FAF6E]"
							: "opacity-50 hover:opacity-100 border-transparent"
					}`}
					onClick={() => setActiveFile(file.id)}
				>
					<span className="material-symbols-outlined text-[14px]">
						description
					</span>
					<span className="text-[10px] font-mono tracking-tight text-white">
						{file.name.toUpperCase()}
					</span>
					<button
						type="button"
						className="material-symbols-outlined text-[14px] ml-2 text-white/50 hover:text-white"
						onClick={(e) => {
							e.stopPropagation();
							closeFile(file.id);
						}}
					>
						close
					</button>
				</button>
			))}
		</div>
	);
});

FileTabs.displayName = "FileTabs";
