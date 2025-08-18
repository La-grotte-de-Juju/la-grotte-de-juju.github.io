"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/animation/PageTransition";
import { Home, BookOpen, Users, Palette, Link2, Rocket, Map, ArrowRight, Newspaper } from "lucide-react";
import { BlogSearchBar } from "@/components/blog/BlogSearchBar";

interface PageItem { name: string; path: string; icon: React.ElementType; description: string; }
interface Section { title: string; accent: string; barColor: string; titleGradient: string; pages: PageItem[]; }

const allSections: Section[] = [
	{
		title: "Accueil",
		accent: "text-amber-600",
		barColor: "bg-amber-400",
		titleGradient: "bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400",
		pages: [ { name: "Page d'accueil", path: "/", icon: Home, description: "Point de départ" } ],
	},
	{
		title: "Créations",
		accent: "text-fuchsia-600",
		barColor: "bg-fuchsia-400",
		titleGradient: "bg-gradient-to-r from-fuchsia-500 via-pink-400 to-violet-500",
		pages: [
			{ name: "Bibliothèque BD", path: "/bd", icon: BookOpen, description: "Toutes les bandes dessinées" },
			{ name: "Fan Arts", path: "/fan-art", icon: Palette, description: "Galerie de la communauté" },
		],
	},
	{
		title: "Actualités",
		accent: "text-indigo-600",
		barColor: "bg-indigo-400",
		titleGradient: "bg-gradient-to-r from-indigo-500 via-violet-400 to-purple-500",
		pages: [
			{ name: "Blog", path: "/blog", icon: Newspaper, description: "Articles, annonces & mises à jour" },
		],
	},
	{
		title: "Univers",
		accent: "text-sky-600",
		barColor: "bg-sky-400",
		titleGradient: "bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500",
		pages: [ { name: "Fiches Personnages", path: "/fiches-personnages", icon: Users, description: "Descriptions détaillées" } ],
	},
	{
		title: "Navigation & Liens",
		accent: "text-emerald-600",
		barColor: "bg-emerald-400",
		titleGradient: "bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500",
		pages: [
			{ name: "Liens & Réseaux", path: "/liens", icon: Link2, description: "Réseaux sociaux & soutien" },
			{ name: "Carte du Site", path: "/map", icon: Map, description: "Vous êtes ici" },
		],
	},
	{
		title: "Technique",
		accent: "text-slate-600",
		barColor: "bg-slate-400",
		titleGradient: "bg-gradient-to-r from-slate-500 via-slate-400 to-gray-500",
		pages: [ { name: "Zone Test", path: "/test-github", icon: Rocket, description: "Expérimentations" } ],
	},
];

export default function SiteMapPageRefined() {
	const [search, setSearch] = useState("");

		// Texture bruit légère (base64 PNG 64x64 transparent)
		const NOISE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAOUlEQVR42mP8/5+BFzAyMiKGEAmYGBgYWBgY/jMwMDCYGBgY/v//PwMDA8O/GRgYGP4zMDAwGP4fBgYGABv1DR7O+VqxAAAAAElFTkSuQmCC";
	const filtered = useMemo(() => {
		if (!search.trim()) return allSections;
		const q = search.toLowerCase();
		return allSections
			.map(sec => ({
				...sec,
				pages: sec.pages.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
			}))
			.filter(sec => sec.pages.length > 0);
	}, [search]);

	const containerVariants = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { staggerChildren: 0.12 } },
	};
		const cardVariants = {
			hidden: { opacity: 0, y: 26, filter: "blur(10px) brightness(1.1)", scale: 0.96 },
			show: { opacity: 1, y: 0, filter: "blur(0px) brightness(1)", scale: 1, transition: { type: "spring", stiffness: 280, damping: 30 } },
			exit: { opacity: 0, y: 22, filter: "blur(8px) brightness(1.05)", scale: 0.94, transition: { duration: 0.28 } }
		};
		const sectionTitleVariants = {
			hidden: { opacity: 0, x: -12, filter: "blur(4px)" },
			show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: 'spring', stiffness: 320, damping: 26 } },
			exit: { opacity: 0, x: 12, filter: "blur(6px)", transition: { duration: 0.18 } }
		};
		const itemVariants = {
			hidden: { opacity: 0, y: 14, filter: "blur(6px)", scale: 0.96 },
			show: (i: number) => ({ opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { type: "spring", stiffness: 500, damping: 34, delay: i * 0.04 } }),
			exit: { opacity: 0, y: 10, filter: "blur(5px)", scale: 0.95, transition: { duration: 0.18 } }
		};

		const layoutTransition = { layout: { type: "spring", stiffness: 250, damping: 28, mass: 0.8 } } as const;

		return (
		<PageTransition>
			<div className="min-h-screen relative bg-transparent">

				{/* Fond global (hors cartes) pour correspondre aux autres pages */}
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(247,172,254,0.10),transparent_65%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(148,163,184,0.08),transparent_60%)]" />
				</div>

				<div className="relative z-10 pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
								<div className="text-center max-w-3xl mx-auto mb-14">
									<h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 title-font text-slate-900">Carte du site</h1>
									<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">Accès rapide à toutes les sections du site, triées par importance. Utilise la recherche pour filtrer instantanément.</p>
						<div className="mt-6 flex justify-center">
							<div className="w-full max-w-2xl">
								<BlogSearchBar value={search} onChange={setSearch} placeholder="Rechercher une page…" onReset={() => setSearch("")} />
							</div>
						</div>
					</div>

									{/* Liste verticale stylée */}
									<div className="space-y-14 max-w-3xl mx-auto">
										<AnimatePresence mode="sync">
											{filtered.map((section, idx) => (
												<motion.div
													key={section.title}
													initial="hidden"
													animate="show"
													exit="exit"
													variants={cardVariants}
													transition={{ type: 'spring', stiffness: 260, damping: 30, delay: idx * 0.03 }}
													className="relative"
												>
													<motion.div className="flex items-center gap-3 mb-5" variants={sectionTitleVariants} initial="hidden" animate="show" exit="exit">
														<div className={`relative h-3 w-3 rounded-full ${section.barColor} shadow-inner shadow-white/40 ring-2 ring-white/60`}>
															<div className="absolute inset-0 rounded-full bg-white/30 mix-blend-overlay" />
														</div>
														<h2 className="text-3xl font-extrabold tracking-tighter title-font">
															<span className={`relative inline-block bg-clip-text text-transparent ${section.titleGradient}`}>
																{section.title}
																<span className="absolute inset-0 blur-md opacity-30 ${section.titleGradient}" aria-hidden="true" />
															</span>
														</h2>
														<div className="flex-1 h-px bg-gradient-to-r from-slate-200/70 via-transparent to-transparent" />
													</motion.div>
													<motion.ul layout className="space-y-2">
														<AnimatePresence initial={false}>
															{section.pages.map((p,i) => {
																const Icon = p.icon;
																const highlight = search && p.name.toLowerCase().includes(search.toLowerCase());
																return (
																	<motion.li
																		key={p.path}
																		layout
																		custom={i}
																		variants={itemVariants}
																		initial="hidden"
																		animate="show"
																		exit="exit"
																		transition={layoutTransition}
																	>
																		<Link href={p.path} className="block group/link focus:outline-none">
																			<motion.div
																				layout
																				transition={layoutTransition}
																				whileHover={{ y: -4, boxShadow: "0 8px 24px -8px rgba(0,0,0,0.12)" }}
																				whileTap={{ scale: 0.97 }}
																				className={`relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/85 backdrop-blur-sm px-5 py-4 shadow-sm hover:border-slate-300 transition overflow-hidden ${highlight ? 'ring-2 ring-amber-300/60' : ''}`}
																			>
																				{/* Accent latéral solide */}
																				<div className={`absolute inset-y-0 left-0 w-1.5 rounded-l-2xl ${section.barColor} opacity-70`} />
																				{/* Halo anim hover */}
																				<div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover/link:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.6),transparent_70%)]" />
																				<div className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay opacity-0 group-hover/link:opacity-60 transition duration-500 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]" />
																				<div className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 group-hover/link:scale-105 transition">
																					<Icon className="w-[20px] h-[20px] text-slate-600 group-hover/link:text-slate-800 transition" />
																				</div>
																				<div className="relative flex-1 min-w-0 text-left">
																					<p className="text-sm font-medium text-slate-800 leading-tight truncate">{p.name}</p>
																					<p className="text-xs text-slate-500 line-clamp-1">{p.description}</p>
																				</div>
																				<ArrowRight className="relative w-4 h-4 text-slate-300 group-hover/link:text-slate-500 transition group-hover/link:translate-x-1" />
																			</motion.div>
																		</Link>
																	</motion.li>
																);
															})}
														</AnimatePresence>
															</motion.ul>
													</motion.div>
											))}
										</AnimatePresence>
									</div>

					{filtered.length === 0 && (
						<div className="text-center py-16 text-slate-500">
							Aucune page ne correspond à ta recherche.
						</div>
					)}
				</div>
			</div>
		</PageTransition>
	);
}
