import type React from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PageLayout } from "~/components";

const HomePage: React.FC = memo(() => {
	const { t } = useTranslation();

	return (
		<PageLayout>
			{/* Hero Section */}
			<section className="bg-[#ECEAE4] px-6 py-24 md:py-40 flex flex-col items-center text-center relative overflow-hidden">
				{/* Dot Matrix Background */}
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(#8FAF6E 0.5px, transparent 0.5px)",
						backgroundSize: "20px 20px",
						opacity: 0.15,
					}}
				/>
				<div className="max-w-4xl relative z-10">
					<span className="absolute -top-12 -left-4 font-mono text-[10px] opacity-30 tracking-widest uppercase hidden md:block">
						LOC: 4,821 / BYTES: 124KB
					</span>
					<h1 className="text-5xl md:text-[64px] font-black text-[#1E2B1E] leading-[1.1] tracking-tighter mb-8">
						{t("home.hero.title")}
						<br />
						<span className="text-[#8FAF6E]">{t("home.hero.highlight")}</span>
					</h1>
					<p className="text-xl md:text-[20px] text-[#6B7A6B] max-w-2xl mx-auto mb-12 font-medium">
						{t("home.hero.description")}
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
						<Link
							to="/app"
							className="bg-[#2D3B2D] text-[#ECEAE4] px-8 py-4 text-lg font-bold flex items-center gap-2 hover:bg-[#536252] transition-all duration-200 rounded-arboreal shadow-lg group"
						>
							{t("home.hero.startForFree")}
							<svg
								fill="currentColor"
								height="24"
								viewBox="0 0 24 24"
								width="24"
								className="group-hover:translate-x-1 transition-transform"
							>
								<title>Arrow right</title>
								<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
							</svg>
						</Link>
						<button
							type="button"
							className="bg-transparent text-[#2D3B2D] border border-[#C8C6BE] px-8 py-4 text-lg font-bold hover:bg-[#C8C6BE]/20 transition-all duration-200 rounded-arboreal"
						>
							{t("home.hero.viewOnGithub")}
						</button>
					</div>
					<div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-[#9AA89A] text-[11px] font-mono uppercase tracking-widest">
						<span>{t("home.hero.worksInBrowser")}</span>
						<span className="hidden md:inline opacity-30">•</span>
						<span>{t("home.hero.completelyLocal")}</span>
						<span className="hidden md:inline opacity-30">•</span>
						<span>{t("home.hero.noDataLeaves")}</span>
					</div>
				</div>
				<span className="absolute bottom-8 right-8 font-mono text-[10px] opacity-20 hidden md:block">
					{"ENV: PRODUCTION // LATENCY: 12ms"}
				</span>
			</section>

			{/* Product Mockup Section */}
			<section className="px-6 py-24 bg-background relative">
				<div className="max-w-6xl mx-auto">
					<div className="bg-[#F5F4F0] border border-[#C8C6BE] p-2 shadow-xl relative rounded-arboreal">
						<div className="absolute -top-6 left-4 font-mono text-[9px] text-[#9AA89A] uppercase tracking-widest">
							{t("home.mockup.sessionId")}
						</div>
						{/* Window Header */}
						<div className="flex items-center gap-2 px-4 py-3 bg-[#E4E2DC] border-b border-[#C8C6BE] rounded-t-[6px]">
							<div className="flex gap-1.5">
								<div className="w-3 h-3 rounded-full bg-[#C4C8B9]" />
								<div className="w-3 h-3 rounded-full bg-[#C4C8B9]" />
								<div className="w-3 h-3 rounded-full bg-[#C4C8B9]" />
							</div>
							<div className="mx-auto text-[10px] font-mono tracking-widest text-[#9AA89A] uppercase">
								feedbag.dev/app
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
							{/* Col 1: Project Tree */}
							<div className="md:col-span-3 border-r border-[#C8C6BE] bg-[#F5F4F0] p-4 font-mono text-xs overflow-hidden">
								<div className="flex items-center gap-2 text-[#4a662e] mb-4 font-bold uppercase tracking-tighter">
									<svg
										fill="currentColor"
										height="20"
										viewBox="0 0 24 24"
										width="20"
									>
										<title>Project Root</title>
										<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
									</svg>
									{t("home.mockup.projectRoot")}
								</div>
								<ul className="space-y-2 text-[#44483d]">
									<li className="flex items-center gap-2 opacity-60">
										<svg
											fill="currentColor"
											height="18"
											viewBox="0 0 24 24"
											width="18"
										>
											<title>components</title>
											<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
										</svg>
										components
									</li>
									<li className="flex items-center gap-2 pl-4">
										<svg
											fill="currentColor"
											height="16"
											viewBox="0 0 24 24"
											width="16"
											className="text-[#7b5804]"
										>
											<title>App.tsx</title>
											<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
										</svg>
										App.tsx
									</li>
									<li className="flex items-center gap-2 pl-4 text-[#536252] font-bold bg-[#8FAF6E]/10 rounded px-1 -mx-1">
										<svg
											fill="currentColor"
											height="16"
											viewBox="0 0 24 24"
											width="16"
										>
											<title>Hero.tsx</title>
											<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										Hero.tsx
									</li>
									<li className="flex items-center gap-2 pl-4 text-[#536252] font-bold bg-[#8FAF6E]/10 rounded px-1 -mx-1">
										<svg
											fill="currentColor"
											height="16"
											viewBox="0 0 24 24"
											width="16"
										>
											<title>Nav.tsx</title>
											<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										Nav.tsx
									</li>
									<li className="flex items-center gap-2 opacity-60">
										<svg
											fill="currentColor"
											height="18"
											viewBox="0 0 24 24"
											width="18"
										>
											<title>lib</title>
											<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
										</svg>
										lib
									</li>
									<li className="flex items-center gap-2 pl-4 opacity-60">
										<svg
											fill="currentColor"
											height="16"
											viewBox="0 0 24 24"
											width="16"
											className="text-[#7b5804]"
										>
											<title>utils.ts</title>
											<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
										</svg>
										utils.ts
									</li>
									<li className="flex items-center gap-2 text-[#536252] font-bold bg-[#8FAF6E]/10 rounded px-1 -mx-1">
										<svg
											fill="currentColor"
											height="16"
											viewBox="0 0 24 24"
											width="16"
										>
											<title>package.json</title>
											<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
										</svg>
										package.json
									</li>
								</ul>
							</div>
							{/* Col 2: Pack List */}
							<div className="md:col-span-4 border-r border-[#C8C6BE] bg-white p-6 relative">
								<div className="flex justify-between items-center mb-6">
									<h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#9AA89A]">
										{t("home.mockup.currentPack")}
									</h3>
									<span className="px-1.5 py-0.5 bg-[#8FAF6E]/10 text-[#8FAF6E] font-mono text-[9px] font-bold border border-[#8FAF6E]/20 rounded">
										{t("home.mockup.filesActive")}
									</span>
								</div>
								<div className="space-y-3">
									<div className="p-3 border border-[#C8C6BE] bg-[#FBF9F3] flex justify-between items-center rounded-arboreal">
										<span className="text-sm font-mono text-[#1B1C18]">
											Hero.tsx
										</span>
										<span className="text-[10px] text-[#8FAF6E] font-mono font-bold">
											1.2kb
										</span>
									</div>
									<div className="p-3 border border-[#C8C6BE] bg-[#FBF9F3] flex justify-between items-center rounded-arboreal">
										<span className="text-sm font-mono text-[#1B1C18]">
											Nav.tsx
										</span>
										<span className="text-[10px] text-[#8FAF6E] font-mono font-bold">
											0.8kb
										</span>
									</div>
									<div className="p-3 border border-[#C8C6BE] bg-[#FBF9F3] flex justify-between items-center rounded-arboreal">
										<span className="text-sm font-mono text-[#1B1C18]">
											package.json
										</span>
										<span className="text-[10px] text-[#8FAF6E] font-mono font-bold">
											2.4kb
										</span>
									</div>
								</div>
								<div className="mt-8">
									<label
										className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#9AA89A] block mb-2"
										htmlFor="ai-instructions"
									>
										{t("home.mockup.aiInstructions")}
									</label>
									<textarea
										id="ai-instructions"
										className="w-full h-24 p-3 bg-[#FBF9F3] border border-[#C8C6BE] text-xs font-mono focus:ring-2 focus:ring-[#8FAF6E]/20 focus:border-[#4a662e] resize-none rounded-arboreal transition-all outline-none"
										placeholder={t("home.mockup.addContextPlaceholder")}
									/>
								</div>
							</div>
							{/* Col 3: Preview */}
							<div
								className="md:col-span-5 bg-[#30312d] p-6 font-mono text-[10px] text-[#d7e7d3] overflow-auto relative"
								style={
									{
										webkitScrollbar: { display: "none" },
									} as React.CSSProperties
								}
							>
								<div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
									<span className="text-[#9aaa97] uppercase tracking-widest">
										{t("home.mockup.outputPreview")}
									</span>
									<div className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-[#8FAF6E] animate-pulse" />
										<span className="text-[#eec068]">~4,200 tokens</span>
									</div>
								</div>
								<div className="space-y-4">
									<div className="text-[#8FAF6E] opacity-70 mb-2 border-l-2 border-[#8FAF6E] pl-2 py-1 bg-[#8FAF6E]/5">
										{t("home.mockup.streamingContent")}
									</div>
									<div>
										<span className="text-[#eec068] opacity-50">
											# Project Context:
										</span>
										<br />I am working on the landing page layout. Focus on
										fixing the alignment of the hero section.
									</div>
									<div>
										<span className="text-[#eec068] opacity-50">
											--- Hero.tsx ---
										</span>
										<br />
										export const Hero = () =&gt; {"{"}
										<br />
										&nbsp;&nbsp;return (
										<br />
										&nbsp;&nbsp;&nbsp;&nbsp;&lt;section
										className="bg-[#ECEAE4]..."&gt;
										<br />
										&nbsp;&nbsp;&nbsp;&nbsp;)
										<br />
										{"}"}
									</div>
								</div>
							</div>
						</div>
						<div className="bg-[#2D3B2D] p-4 flex justify-between items-center rounded-b-[6px]">
							<span className="font-mono text-[9px] text-[#8FAF6E] tracking-widest hidden sm:block">
								{t("home.mockup.statusReadyToCopy")}
							</span>
							<button
								type="button"
								className="bg-[#8FAF6E] text-[#111F12] px-6 py-2 font-mono font-bold flex items-center gap-2 hover:bg-[#a7c28a] transition-all rounded-arboreal"
							>
								<svg
									fill="currentColor"
									height="20"
									viewBox="0 0 24 24"
									width="20"
								>
									<title>{t("home.mockup.copyToClipboard")}</title>
									<path d="M16 1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3l-3-2zm0 18H4V3h11v3h3v11zM8 15h2volum2H8v-2zm0-4h2volum2H8v-2zm0-4h2volum2H8V7zm6 8h-2volum2h2v-2zm0-4h-2volum2h2v-2zm0-4h-2volum2h2V7z" />
								</svg>
								{t("home.mockup.copyToClipboard")}
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Feature Cards Section */}
			<section className="px-6 py-24 bg-surface-container-low">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Feature 1 */}
					<div className="bg-[#F5F4F0] border border-[#C8C6BE] p-8 flex flex-col items-start hover:border-[#536252] hover:shadow-lg transition-all duration-300 relative rounded-arboreal group">
						<span className="absolute top-4 right-4 font-mono text-[9px] text-[#9AA89A]">
							F_01
						</span>
						<div className="bg-[#8FAF6E]/20 text-[#8FAF6E] p-3 mb-6 rounded-lg group-hover:bg-[#8FAF6E]/30 transition-colors">
							<svg
								fill="currentColor"
								height="48"
								viewBox="0 0 24 24"
								width="48"
							>
								<title>{t("home.features.dragDrop")}</title>
								<path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-[#1E2B1E] mb-4">
							{t("home.features.dragDrop")}
						</h3>
						<p className="text-[#6B7A6B] leading-relaxed">
							{t("home.features.dragDropDesc")}
						</p>
					</div>
					{/* Feature 2 */}
					<div className="bg-[#F5F4F0] border border-[#C8C6BE] p-8 flex flex-col items-start hover:border-[#536252] hover:shadow-lg transition-all duration-300 relative rounded-arboreal group">
						<span className="absolute top-4 right-4 font-mono text-[9px] text-[#9AA89A]">
							F_02
						</span>
						<div className="bg-[#8FAF6E]/20 text-[#8FAF6E] p-3 mb-6 rounded-lg group-hover:bg-[#8FAF6E]/30 transition-colors">
							<svg
								fill="currentColor"
								height="48"
								viewBox="0 0 24 24"
								width="48"
							>
								<title>{t("home.features.perProject")}</title>
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-[#1E2B1E] mb-4">
							{t("home.features.perProject")}
						</h3>
						<p className="text-[#6B7A6B] leading-relaxed">
							{t("home.features.perProjectDesc")}
						</p>
					</div>
					{/* Feature 3 */}
					<div className="bg-[#F5F4F0] border border-[#C8C6BE] p-8 flex flex-col items-start hover:border-[#536252] hover:shadow-lg transition-all duration-300 relative rounded-arboreal group">
						<span className="absolute top-4 right-4 font-mono text-[9px] text-[#9AA89A]">
							F_03
						</span>
						<div className="bg-[#8FAF6E]/20 text-[#8FAF6E] p-3 mb-6 rounded-lg group-hover:bg-[#8FAF6E]/30 transition-colors">
							<svg
								fill="currentColor"
								height="48"
								viewBox="0 0 24 24"
								width="48"
							>
								<title>{t("home.features.tokenAware")}</title>
								<path d="M22.6 12c0-5.86-4.74-10.6-10.6-10.6S1.4 6.14 1.4 12s4.74 10.6 10.6 10.6S22.6 17.86 22.6 12zM12 19.8c-4.3 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8zm1.6-9.2h-3.2v6.4h3.2v-6.4z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-[#1E2B1E] mb-4">
							{t("home.features.tokenAware")}
						</h3>
						<p className="text-[#6B7A6B] leading-relaxed">
							{t("home.features.tokenAwareDesc")}
						</p>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="px-6 py-32 bg-background relative">
				<span className="absolute top-10 right-10 font-mono text-[10px] opacity-10 hidden md:block uppercase tracking-widest">
					Protocol: Direct_Injection_v1.0
				</span>
				<div className="max-w-6xl mx-auto text-center mb-20">
					<h2 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#8FAF6E] mb-4">
						{t("home.workflow.badge")}
					</h2>
					<h3 className="text-4xl font-black text-[#1E2B1E]">
						{t("home.workflow.title")}
					</h3>
				</div>
				<div className="max-w-5xl mx-auto relative">
					{/* Connector Line */}
					<div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-[#C8C6BE] z-0" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
						<div className="flex flex-col items-center text-center">
							<div className="w-14 h-14 rounded-full bg-[#8FAF6E] text-white flex items-center justify-center text-xl font-mono font-bold mb-8 shadow-md">
								1
							</div>
							<h4 className="text-lg font-bold text-[#1E2B1E] mb-2 uppercase tracking-tighter">
								{t("home.workflow.step1")}
							</h4>
							<p className="text-[#6B7A6B] text-sm leading-relaxed px-4">
								{t("home.workflow.step1Desc")}
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="w-14 h-14 rounded-full bg-[#8FAF6E] text-white flex items-center justify-center text-xl font-mono font-bold mb-8 shadow-md">
								2
							</div>
							<h4 className="text-lg font-bold text-[#1E2B1E] mb-2 uppercase tracking-tighter">
								{t("home.workflow.step2")}
							</h4>
							<p className="text-[#6B7A6B] text-sm leading-relaxed px-4">
								{t("home.workflow.step2Desc")}
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="w-14 h-14 rounded-full bg-[#8FAF6E] text-white flex items-center justify-center text-xl font-mono font-bold mb-8 shadow-md">
								3
							</div>
							<h4 className="text-lg font-bold text-[#1E2B1E] mb-2 uppercase tracking-tighter">
								{t("home.workflow.step3")}
							</h4>
							<p className="text-[#6B7A6B] text-sm leading-relaxed px-4">
								{t("home.workflow.step3Desc")}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="bg-[#536252] px-6 py-24 text-center relative overflow-hidden">
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage:
							"radial-gradient(#8FAF6E 0.5px, transparent 0.5px)",
						backgroundSize: "20px 20px",
					}}
				/>
				<div className="max-w-2xl mx-auto relative z-10">
					<h2 className="text-3xl md:text-5xl font-black text-[#ECEAE4] mb-8 leading-tight">
						{t("home.cta.title")}
					</h2>
					<Link
						to="/app"
						className="bg-[#8FAF6E] text-[#111F12] px-10 py-5 text-xl font-bold hover:bg-[#a7c28a] transition-all transform active:scale-95 shadow-xl rounded-arboreal"
					>
						{t("home.cta.button")}
					</Link>
					<p className="mt-8 text-[#ECEAE4]/60 text-xs font-mono uppercase tracking-widest">
						{t("home.cta.availableNow")}
					</p>
				</div>
			</section>
		</PageLayout>
	);
});

HomePage.displayName = "HomePage";

export default HomePage;
