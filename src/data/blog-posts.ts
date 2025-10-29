export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string; // ISO
  cover?: string; // image optionnelle
}

export const blogPosts: BlogPost[] = [
  {
    id: 'lancement-blog',
    title: "Lancement du Blog de La Grotte",
    excerpt: "Bienvenue sur le nouveau centre d'actualités ! Annonces vidéos, coulisses, events et évolution de l'univers.",
    content: `Bienvenue sur le blog officiel ! Ici tu retrouveras les annonces des vidéos, coulisses, events, évolutions narratives et focus sur les personnages.\n\nCe lancement pose les bases : un système sera bientôt branché pour publier de vrais articles. Reste dans le coin.`,
    date: new Date().toISOString(),
    cover: '/images/headerfullresV1.webp'
  },
  {
    id: 'prochaine-video',
    title: "Prochaine vidéo en préparation",
    excerpt: "Un aperçu rapide du prochain contenu YouTube et de ce qui arrive côté BD.",
    content: `Petit teasing de la prochaine vidéo : montage en cours, nouvelles séquences d'animation et essais d'effets son.\n\nCôté BD : itération storyboard + relecture dialogues.`,
    date: new Date(Date.now() - 1000*60*60*24*2).toISOString(),
    cover: '/images/batlife-animation.png'
  },
  {
    id: 'evenement-discord',
    title: 'Événement Discord Communautaire',
    excerpt: 'Organisation d\'un live dessin + Q&A + mini concours fan-art ce week-end.',
    content: `On prépare un event : live dessin (2h), Q&A ouvert, mini concours fan-art sur un thème révélé en direct.\n\nRécompenses symboliques et mise en avant sur le site.`,
    date: new Date(Date.now() - 1000*60*60*24*5).toISOString(),
    cover: '/images/footer-gradient.webp'
  },
  {
    id: 'maj-bd',
    title: 'Mise à jour BD : nouveaux planches',
    excerpt: 'Ajout de nouvelles planches expérimentales et retouches colorimétriques.',
    content: `Les nouvelles planches testent un traitement lumière plus ciné. Feedback bienvenu.\n\nRetouches colorimétriques sur les précédentes : saturation réduite, contraste local.`,
    date: new Date(Date.now() - 1000*60*60*24*9).toISOString(),
    cover: '/images/linkplaceholderfullres.webp'
  }
];
