"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";

const latestVideos = [
	{
		id: "video-1",
		title: "Une nouvelle aventure pour Batlife",
		thumbnail: "/images/dev img/6.webp",
		date: "Il y a 2 jours",
		views: "42K vues",
		link: "https://youtube.com/watch?v=example1",
	},
	{
		id: "video-2",
		title: "Tower of Babel - Épisode 5",
		thumbnail: "/images/dev img/4.webp",
		date: "Il y a 1 semaine",
		views: "38K vues",
		link: "https://youtube.com/watch?v=example2",
	},
	{
		id: "video-3",
		title: "Chasseurs de Sorciers - Le nouveau chapitre",
		thumbnail: "/images/dev img/5.webp",
		date: "Il y a 2 semaines",
		views: "56K vues",
		link: "https://youtube.com/watch?v=example3",
	},
];

export function LatestVideosSection() {
	return (
		<section className="py-20 bg-transparent dark:bg-transparent">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
					<AnimateOnScroll animation="apple-slide">
						<div className="space-y-2">
							<h2 className="text-3xl font-bold tracking-tighter md:text-4xl title-font">
								Dernières{" "}
								<span className="text-primary">Vidéos YouTube</span>
							</h2>
							<p className="max-w-[600px] text-muted-foreground md:text-xl">
								Restez à jour avec les contenus les plus récents de La Grotte de
								Juju
							</p>
						</div>
					</AnimateOnScroll>
					<AnimateOnScroll animation="magnetic-pull">
						<Link href="/actu/dernieres-videos" prefetch={false}>
							<Button variant="outline" size="lg" className="gap-2">
								Voir toutes les vidéos
							</Button>
						</Link>
					</AnimateOnScroll>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{latestVideos.map((video, index) => (
						<AnimateOnScroll
							key={video.id}
							animation="floating-card"
							delay={0.2 * (index + 1)}
						>
							<Card className="overflow-hidden">
								<div className="aspect-video relative group">
									<Image
										src={video.thumbnail}
										alt={video.title}
										fill
									/>
									<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="48"
											height="48"
											viewBox="0 0 24 24"
											fill="white"
											stroke="none"
											className="transition-transform group-hover:scale-110"
										>
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								</div>
								<CardHeader className="pb-2">
									<CardTitle className="text-xl">{video.title}</CardTitle>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="flex items-center text-sm text-muted-foreground gap-3">
										<span>{video.date}</span>
										<span>•</span>
										<span>{video.views}</span>
									</div>
								</CardContent>
								<CardFooter>
									<a
										href={video.link}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full"
									>
										<Button variant="outline" className="w-full gap-2">
											Regarder
											<ExternalLink className="h-4 w-4" />
										</Button>
									</a>
								</CardFooter>
							</Card>
						</AnimateOnScroll>
					))}
				</div>
			</div>
		</section>
	);
}

export default LatestVideosSection;
