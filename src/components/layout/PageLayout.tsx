import type React from "react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { LanguageSwitchButton } from "../language-switch";

type HeaderProps = {
	versionText?: string;
};

const Header: React.FC<HeaderProps> = memo(
	({ versionText = "v1.0.0-STABLE" }) => {
		const { t } = useTranslation();
		const effectiveLogoText = t("layout.header.logo");
		const effectiveOpenAppText = t("layout.header.openApp");
		const effectiveGithubText = t("layout.header.github");

		return (
			<nav className="bg-[#2D3B2D] dark:bg-[#1b241b] text-[#ECEAE4] flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50 transition-colors duration-200">
				<NavLink to="/" className="flex items-center gap-2">
					{/* Logo SVG */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke="#9AA89A"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="#8FAF6E"
					>
						<title>{effectiveLogoText}</title>
						<path d="M14 4.1 12 6" />
						<path d="m5.1 8-2.9-.8" />
						<path d="m6 12-1.9 2" />
						<path d="M7.2 2.2 8 5.1" />
						<path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
					</svg>
					<span className="text-xl font-mono font-bold text-[#ECEAE4] dark:text-[#fbf9f3]">
						{effectiveLogoText}
					</span>
				</NavLink>
				<div className="flex items-center gap-4">
					<span className="hidden md:block font-mono text-[10px] tracking-tighter opacity-50 uppercase">
						{versionText}
					</span>
					<div className="flex items-center gap-6">
						<LanguageSwitchButton />
						{/* GitHub Link */}
						<a
							className="text-[#8FAF6E] font-bold font-mono text-sm tracking-widest uppercase items-center gap-1.5"
							href="https://github.com/zplor/feedbag"
							target="_blank"
							rel="noopener noreferrer"
						>
							{/* GitHub Icon */}
							<svg
								fill="currentColor"
								height="16"
								viewBox="0 0 24 24"
								width="16"
							>
								<title>{effectiveGithubText}</title>
								<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
							</svg>
						</a>
					</div>
					{/* Open App Button */}
					<Link
						to="/app"
						className="bg-[#536252] text-[#ECEAE4] px-5 py-2 ml-5 font-mono text-sm tracking-widest uppercase hover:bg-[#8FAF6E] transition-all duration-200 rounded-arboreal hover:shadow-md"
					>
						{effectiveOpenAppText}
					</Link>
				</div>
			</nav>
		);
	},
);

const Footer: React.FC = memo(() => {
	const { t } = useTranslation();
	const effectiveLogoText = t("layout.header.logo");
	const effectiveTagline = t("layout.footer.tagline");
	const effectiveGithubText = t("layout.header.github");
	const effectivePrivacyText = t("layout.footer.privacy");
	const effectiveDocsText = t("layout.footer.docs");

	return (
		<footer className="bg-[#2D3B2D] dark:bg-[#1b241b] text-[#9AA89A] flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 transition-opacity border-t border-white/5">
			<div className="flex flex-col md:flex-row items-center gap-6 mb-6 md:mb-0">
				<div className="flex items-center gap-2">
					{/* Logo SVG */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke="#9AA89A"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="#8FAF6E"
					>
						<title>{effectiveLogoText}</title>
						<path d="M14 4.1 12 6" />
						<path d="m5.1 8-2.9-.8" />
						<path d="m6 12-1.9 2" />
						<path d="M7.2 2.2 8 5.1" />
						<path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
					</svg>
					<span className="text-[#ECEAE4] font-mono font-bold uppercase tracking-widest">
						{effectiveLogoText}
					</span>
				</div>
				<span className="text-[0.7rem] font-mono tracking-widest uppercase opacity-40">
					{effectiveTagline}
				</span>
			</div>
			<div className="flex gap-8">
				<a
					className="text-[0.75rem] font-mono font-medium tracking-widest uppercase text-[#9AA89A] hover:text-[#8FAF6E] transition-colors flex items-center gap-1.5"
					href="https://github.com/zplor/feedbag"
					target="_blank"
					rel="noopener noreferrer"
				>
					{/* GitHub Icon */}
					<svg fill="currentColor" height="12" viewBox="0 0 24 24" width="12">
						<title>{effectiveGithubText}</title>
						<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
					</svg>
					{effectiveGithubText}
				</a>
				{/* <a
					className="text-[0.75rem] font-mono font-medium tracking-widest uppercase text-[#9AA89A] hover:text-[#ECEAE4] transition-colors"
					href="/privacy"
				>
					{effectivePrivacyText}
				</a>
				<a
					className="text-[0.75rem] font-mono font-medium tracking-widest uppercase text-[#9AA89A] hover:text-[#ECEAE4] transition-colors"
					href="/docs"
				>
					{effectiveDocsText}
				</a> */}
			</div>
		</footer>
	);
});

export type PageLayoutProps = {
	children: React.ReactNode;
};

export const PageLayout: React.FC<PageLayoutProps> = memo(({ children }) => {
	return (
		<div className="antialiased selection:bg-primary-container selection:text-on-primary-container">
			<Header />
			<main className="pt-20">{children}</main>
			<Footer />
		</div>
	);
});
