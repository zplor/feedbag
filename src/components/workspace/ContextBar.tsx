import type React from "react";
import { memo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkspaceStore } from "~/store/workspace";

export const ContextBar: React.FC = memo(() => {
	const { t } = useTranslation();
	const { getCurrentPack, updatePackContext, currentPackId } =
		useWorkspaceStore();
	const currentPack = getCurrentPack();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [contextText, setContextText] = useState("");
	const modalRef = useRef<HTMLDivElement>(null);

	// Sync context text with current pack
	useEffect(() => {
		if (currentPack) {
			setContextText(currentPack.context);
		}
	}, [currentPack]);

	const handleEditClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSaveContext = () => {
		if (currentPackId) {
			updatePackContext(currentPackId, contextText);
		}
		handleCloseModal();
	};

	// Handle click outside modal
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				setIsModalOpen(false);
			}
		};

		if (isModalOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isModalOpen]);

	return (
		<div className="bg-[#F5F4F0] border-b border-[#C8C6BE] px-6 h-12 flex items-center justify-between z-40">
			<div className="flex items-center gap-3 overflow-hidden relative group">
				<span className="material-symbols-outlined text-[#74796c] text-[18px]">
					psychology
				</span>
				<span className="text-[11px] font-medium text-on-surface-variant/60 truncate max-w-lg cursor-help">
					{contextText || t("workspace.context.current")}
				</span>
				{/* Tooltip */}
				<div className="tooltip-box opacity-0 invisible absolute top-10 left-0 bg-inverse-surface text-white text-[11px] p-3 w-[400px] shadow-xl transition-all duration-200 z-50 pointer-events-none rounded-lg group-hover:opacity-100 group-hover:visible">
					{contextText || t("workspace.context.tooltip")}
				</div>
			</div>
			<div className="context-dropdown relative">
				<button
					type="button"
					className="flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white border border-[#C8C6BE] hover:bg-[#8FAF6E] hover:text-white transition-all outline-none rounded-lg"
					onClick={handleEditClick}
				>
					<span className="material-symbols-outlined text-[14px]">edit</span>
					{t("workspace.context.editButton")}
				</button>

				{/* Modal Overlay */}
				{isModalOpen && (
					<div
						ref={modalRef}
						className="context-modal absolute right-0 top-12 w-[480px] bg-white border border-[#C8C6BE] shadow-2xl p-6 z-[60] rounded-xl"
					>
						<label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant block mb-3">
							{t("workspace.context.modalTitle")}
						</label>
						<textarea
							value={contextText}
							onChange={(e) => setContextText(e.target.value)}
							className="w-full h-48 bg-[#fbf9f3] border border-outline-variant/30 outline-0 focus:ring-2 focus:ring-[#8FAF6E]/30 font-body text-sm p-4 resize-none placeholder:italic placeholder:text-on-surface-variant/30 mb-4 rounded-lg"
							placeholder={t("workspace.context.placeholder")}
						/>
						<div className="flex justify-end">
							<button
								type="button"
								className="bg-[#8FAF6E] text-white font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-[#7e9c5f] rounded-lg transition-colors"
								onClick={handleSaveContext}
							>
								{t("workspace.context.saveButton")}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
});

ContextBar.displayName = "ContextBar";
