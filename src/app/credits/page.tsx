import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crédits & Licences | La Grotte de Juju",
  description: "Remerciements, crédits des librairies et ressources utilisées sur le site.",
};

export default function CreditsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 prose dark:prose-invert">
      <h1>Crédits & Licences</h1>
      <p>
        Merci d&apos;utiliser et de soutenir le site de la Grotte de Juju ! Voici une liste
        des principales ressources, bibliothèques et personnes à remercier.
      </p>

      <h2>Technologies principales</h2>
      <ul>
        <li>Next.js</li>
        <li>React</li>
        <li>Tailwind CSS</li>
        <li>framer-motion</li>
        <li>lucide-react (icônes)</li>
      </ul>

      <h2>Police / Icônes / Médias</h2>
      <ul>
        <li>Icônes : <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer">Lucide</a></li>
        <li>Animations Lottie si utilisées (lien ou attribution spécifique le cas échéant)</li>
      </ul>

      <h2>Open Source</h2>
      <p>
        Merci à la communauté open source. Sans ces outils, ce site serait beaucoup plus long à créer.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute demande ou crédit manquant, vous pouvez ouvrir une issue sur le dépôt GitHub ou me contacter via YouTube.
      </p>

      <p>
        <Link href="/">← Retour à l&apos;accueil</Link>
      </p>
    </div>
  );
}
