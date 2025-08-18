// Fetch dynamique des données blog (annonces & nouvelles vidéos) depuis le dépôt ressources
// URL JSON distante
export const REMOTE_BLOG_URL = "https://raw.githubusercontent.com/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/refs/heads/main/blog_data.json";

// Types distants bruts
export interface RemoteVideoEntry {
  type: 'video';
  title: string; // Titre vidéo original
  description: string;
  video_url: string;
  thumbnail_url: string;
  video_id: string;
  channel: string;
  published_date: string; // ISO
  discord_message_id: string;
  discord_channel_id: string;
  author: string;
  category: string; // "nouvelle_video"
}

export interface RemoteAnnouncementEntry {
  type: 'announcement';
  title: string; // Titre brut (mais pour carte on override)
  description: string;
  published_date: string; // ISO
  discord_message_id: string;
  discord_channel_id: string;
  author: string;
  category: string; // "annonce"
  attachments: string[]; // URLs (images / potentiels liens)
}

export interface RemoteBlogPayload {
  articles?: unknown[]; // ignoré pour l'instant
  videos?: RemoteVideoEntry[];
  announcements?: RemoteAnnouncementEntry[];
  metadata?: Record<string, unknown>;
}

// Type interne unifié pour l'UI
export type BlogKind = 'annonce' | 'nouvelle_video';

export interface BlogUnifiedItem {
  id: string; // discord_message_id
  kind: BlogKind;
  title: string; // Formaté selon règles business
  author: string;
  date: string; // ISO
  cover?: string; // Image de couverture
  description: string; // description complète
  rawTitle: string; // titre original (video.title / announcement.title)
  // Spécifiques
  videoUrl?: string;
  attachments?: string[];
  externalLinks?: string[]; // Liens détectés dans la description (hors videoUrl)
}

// Images fallback (dans public/images/blog-default)
// Ajouter simplement de nouveaux fichiers dans ce dossier puis compléter ce tableau si besoin.
// (On évite la lecture dynamique du FS car ce fetch s'exécute côté client.)
const FALLBACK_DEFAULTS: string[] = [
  '/images/blog-default/1.webp',
  '/images/blog-default/2.webp',
  '/images/blog-default/3.webp',
  '/images/blog-default/4.webp',
  '/images/blog-default/5.webp',
  '/images/blog-default/6.webp',
  '/images/blog-default/indev.webp',
];

// Fallback ultime si aucun fichier fourni
const ABSOLUTE_FALLBACK = '/images/juju-logo.webp';

function pickFallback(): string {
  if (FALLBACK_DEFAULTS.length === 0) return ABSOLUTE_FALLBACK;
  const i = Math.floor(Math.random() * FALLBACK_DEFAULTS.length);
  return FALLBACK_DEFAULTS[i];
}

// Extraction de liens HTTP(s) depuis un texte
const URL_REGEX = /(https?:\/\/[^\s)]+)(?=\)?)/gi;

export async function fetchRemoteBlog(signal?: AbortSignal): Promise<BlogUnifiedItem[]> {
  // Ajout d'un paramètre de bust cache pour forcer un nouveau téléchargement à chaque refresh
  const url = REMOTE_BLOG_URL + (REMOTE_BLOG_URL.includes('?') ? '&' : '?') + '_ts=' + Date.now();
  const res = await fetch(url, { cache: 'no-store', signal });
  if (!res.ok) throw new Error('Echec chargement blog: ' + res.status);
  const json: RemoteBlogPayload = await res.json();

  const items: BlogUnifiedItem[] = [];

  json.videos?.forEach(v => {
    const linksInDesc = extractLinks(v.description).filter(u => u !== v.video_url);
    const cover = v.thumbnail_url && v.thumbnail_url.trim() !== '' ? v.thumbnail_url : pickFallback();
    items.push({
      id: v.discord_message_id,
      kind: 'nouvelle_video',
      title: `Nouvelle vidéo : ${v.title}`,
      author: v.author,
      date: v.published_date,
      cover,
      description: v.description,
      rawTitle: v.title,
      videoUrl: v.video_url,
      attachments: [],
      externalLinks: linksInDesc,
    });
  });

  json.announcements?.forEach(a => {
    // Choisir la première pièce jointe image sinon fallback aléatoire
    const firstImage = a.attachments?.find(isLikelyImageUrl);
    const cover = firstImage || pickFallback();
    const linksInDesc = extractLinks(a.description);
    items.push({
      id: a.discord_message_id,
      kind: 'annonce',
      title: `Annonce de ${a.author.toUpperCase()}`,
      author: a.author,
      date: a.published_date,
      cover,
      description: a.description,
      rawTitle: a.title,
      attachments: a.attachments,
      externalLinks: linksInDesc.filter(u => !a.attachments?.includes(u)),
    });
  });

  // Tri décroissant par date
  items.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
}

function extractLinks(text: string): string[] {
  const s = new Set<string>();
  for (const m of text.matchAll(URL_REGEX)) {
    try { s.add(new URL(m[1]).toString()); } catch {}
  }
  return [...s];
}

// Heuristique simple pour déterminer si une URL est probablement une image
function isLikelyImageUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    const p = u.pathname.toLowerCase();
    if (/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(p)) return true;
    // Cas CDN sans extension explicite (rare) : on pourrait ajouter d'autres heuristiques plus tard
    return false;
  } catch {
    return false;
  }
}

// Fonction conservée pour compat rétro mais désormais identique (toujours frais)
export async function getBlogDataCached(): Promise<BlogUnifiedItem[]> {
  return fetchRemoteBlog();
}
