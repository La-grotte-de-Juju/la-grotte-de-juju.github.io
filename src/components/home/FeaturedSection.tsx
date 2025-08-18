"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";
import { motion } from "framer-motion";
import { BookOpen, Users, Sparkles, ArrowRight, Newspaper } from "lucide-react";
import { useState } from "react";

const featuredItems = [
	{
		title: "Bibliothèque de La Grotte",
		description: "Entre dans la Bibliothèque de La Grotte et retrouve toutes les bandes dessinées créées par Juju, mêlant humour, aventures et univers uniques à découvrir sans modération.",
		image: "/images/animation/Strip-grotte-Visual.gif",
		link: "/bd",
		icon: BookOpen,
		category: "BD & Comics",
		color: "from-emerald-500 to-teal-600",
		bgPattern: "bg-emerald-50 dark:bg-emerald-950/20",
		shadowRgb: "16,185,129" // emerald-500
	},
	{
		title: "Galerie des Héros",
		description: "Découvrez les personnages attachants de La Grotte avec leurs histoires fascinantes et leurs secrets les mieux gardés.",
		image: "/images/animation/fichepersos.gif",
		link: "/fiches-personnages",
		icon: Users,
		category: "Personnages",
		color: "from-purple-500 to-indigo-600",
		bgPattern: "bg-purple-50 dark:bg-purple-950/20",
		shadowRgb: "168,85,247" // purple-500
	},
	{
		title: "Blog de La Grotte",
		description: "Toutes les news de l'univers : annonces YouTube, nouveautés des BD, events Discord, coulisses et mises à jour des autres réseaux – tout est centralisé ici !",
		image: "/images/headerfullresV1.webp",
		link: "/blog",
		icon: Newspaper,
		category: "Actus & News",
		color: "from-sky-500 to-blue-600",
		bgPattern: "bg-sky-50 dark:bg-sky-950/20",
		shadowRgb: "14,165,233" // sky-500
	},
];

function FeatureCard({ item, index }: { item: typeof featuredItems[0], index: number }) {
	const [isHovered, setIsHovered] = useState(false);

	// Ombres : base neutre + hover légèrement teinté (subtile, moins saturé)
	const baseShadow = "0 2px 6px -2px rgba(0,0,0,0.08), 0 1px 3px -1px rgba(0,0,0,0.04)";
	const hoverShadow = [
		"0 4px 18px -4px rgba(0,0,0,0.14)",
		"0 2px 8px -2px rgba(0,0,0,0.08)",
		`0 0 0 1px rgba(${item.shadowRgb},0.22)`, // léger ring teinté
		`0 0 0 6px rgba(${item.shadowRgb},0.06)` // halo très doux
	].join(", ");
	
	return (
		<motion.div
			className="group relative h-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ y: -8 }}
			transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
		>
			{/* Carte principale avec effets de hover optimisés */}
			<div
				className="relative h-full rounded-3xl overflow-hidden transition-all duration-300 tinted-surface tinted-surface-hover"
				style={{ boxShadow: isHovered ? hoverShadow : baseShadow, willChange: "transform, box-shadow" }}
			>
				
				{/* Image avec ratio 16:9 et effets optimisés */}
				<div className="relative aspect-video overflow-hidden">
					<Image
						src={item.image}
						alt={item.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					
					{/* Overlay gradient simplifié */}
					<div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
					
					{/* Badge catégorie flottant */}
					<div className="absolute top-4 left-4 z-20">
						<div className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${item.color} text-white shadow-lg`}>
							{item.category}
						</div>
					</div>
				</div>				{/* Contenu avec design moderne */}
				<div className="p-8 space-y-4">
					{/* Titre */}
					<h3 className="text-2xl font-bold title-font text-gray-900 dark:text-white transition-all duration-300">
						{item.title}
					</h3>

					{/* Description */}
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
						{item.description}
					</p>

					{/* Bouton d'action moderne */}
					<motion.div
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="pt-4"
					>
						<Link href={item.link} className="block">
							<Button
								className={`w-full bg-gradient-to-r ${item.color} hover:shadow-xl text-white border-0 font-bold py-4 rounded-2xl transition-all duration-300 group/btn`}
								size="lg"
							>
								<span className="flex items-center justify-center gap-3">
									<Sparkles className="w-5 h-5" />
									Découvrir maintenant
									<motion.div
										animate={{ x: isHovered ? 6 : 0 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										<ArrowRight className="w-5 h-5" />
									</motion.div>
								</span>
							</Button>
						</Link>
					</motion.div>
				</div>
				
				{/* Effet de brillance au hover */}
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
				</div>
			</div>
			
			{/* Halo doux (glow) beaucoup plus subtil */}
			<div
				className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-70 transition duration-500 -z-10"
				style={{
					background: `radial-gradient(circle at 50% 65%, rgba(${item.shadowRgb},0.28), rgba(${item.shadowRgb},0) 65%)`,
					filter: "blur(26px)",
					transform: "translateY(26px) scale(0.96)",
				}}
			></div>
		</motion.div>
	);
}

export function FeaturedSection() {
	return (
		<section className="py-24 bg-transparent dark:bg-transparent relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '600px' }}>
			{/* Éléments décoratifs de fond simplifiés */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
				<div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/3 rounded-full blur-2xl"></div>
			</div>
			
			<div className="container px-4 md:px-6 relative z-10">
				{/* En-tête de section modernisé */}
				<div className="text-center mb-20">
					<AnimateOnScroll animation="smooth-reveal">
						<motion.div 
							className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 px-6 py-3 rounded-full mb-8 border border-primary/20"
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							<Sparkles className="w-5 h-5 text-primary animate-pulse" />
							<span className="text-sm font-bold text-primary">Contenu Exclusif</span>
						</motion.div>
					</AnimateOnScroll>					<AnimateOnScroll animation="crystal-emerge">
						<h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 title-font">
							L'univers de{" "}
							<span className="relative inline-block">
								<span className="text-transparent bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text animate-pulse relative z-10">
									La Grotte
								</span>								{/* Effet de glow multiple couches avec flou plus intense */}
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-md opacity-40 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-lg opacity-35 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-xl opacity-30 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-2xl opacity-25 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
								<span 
									className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent blur-3xl opacity-15 animate-pulse"
									aria-hidden="true"
								>
									La Grotte
								</span>
							</span>
						</h2>
						<p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
							Retrouve le meilleur de la grotte, tout en un seul endroit. 
						</p>
					</AnimateOnScroll>
				</div>

				{/* Grille de cartes avec espacement optimisé */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
					{featuredItems.map((item, index) => (
						<AnimateOnScroll
							key={item.title}
							animation="glass-morph"
							delay={0.2 * (index + 1)}
						>
							<FeatureCard item={item} index={index} />
						</AnimateOnScroll>
					))}
				</div>


			</div>
		</section>
	);
}

export default FeaturedSection;
