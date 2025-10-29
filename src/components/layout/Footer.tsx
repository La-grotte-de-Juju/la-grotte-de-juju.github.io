import Link from "next/link";
import Image from "next/image";
import packageJson from "../../../package.json";
import SITE_VERSION from "@/config/site-version";
import { FileText, Map, Tag } from "lucide-react";
export function Footer() {
		const version = SITE_VERSION || (packageJson as { version?: string })?.version || "0.0.0";
	const year = new Date().getFullYear();

		return (
			<footer className="mt-16 border-t bg-white/85 backdrop-blur-md">
				<div className="mx-auto w-full max-w-screen-2xl px-4 py-8 flex flex-col gap-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
						<Link href="/" className="flex items-center gap-3">
										<Image
											src="/images/juju-logo.webp"
											alt="Logo Juju"
											width={44}
											height={44}
											className="rounded-full"
											priority
										/>
							<span className="text-base sm:text-lg font-semibold tracking-wide">
								La Grotte de Juju
							</span>
						</Link>
						<div className="flex items-center gap-3 flex-wrap">
							<Link
								href="/credits"
								className="text-xs sm:text-sm inline-flex items-center gap-2 rounded-md border border-border/80 bg-white hover:bg-white/60 px-3 py-1.5 transition-colors"
								aria-label="Crédits et licences"
							>
								<FileText className="h-4 w-4 text-primary" />
								<span>Crédits & Licenses</span>
							</Link>
							<Link
								href="/map"
								className="text-xs sm:text-sm inline-flex items-center gap-2 rounded-md border border-border/80 bg-white hover:bg-white/60 px-3 py-1.5 transition-colors"
								aria-label="Carte du site"
							>
								<Map className="h-4 w-4 text-neutral-500" />
								<span>Carte du site</span>
							</Link>
							<span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono tracking-wide rounded-md bg-neutral-100 border border-border px-2.5 py-1 text-neutral-600" aria-label="Version du site">
								<Tag className="h-3.5 w-3.5 opacity-70" />
								{version}
							</span>
						</div>
					</div>
					<div className="text-[11px] sm:text-xs text-neutral-500 flex flex-col gap-1">
						<p>© {year} La Grotte de Juju</p>
					</div>
				</div>
			</footer>
		);
}

export default Footer;
