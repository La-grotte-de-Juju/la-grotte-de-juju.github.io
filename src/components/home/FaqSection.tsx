import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";

const faqs = [
  {
    id: "who-is-juju",
    question: "Qui est La Grotte de Juju ?",
    answer: "La Grotte de Juju est un YouTubeur spécialisé dans l'animation et la création de bandes dessinées. Il est connu pour créer des univers colorés et uniques comme Batlife, Chasseurs de Sorciers et plusieurs autres séries originales."
  },
  {
    id: "main-series",
    question: "Quelles sont les principales séries de La Grotte de Juju ?",
    answer: "Les principales séries incluent Batlife, Chasseurs de Sorciers, Tower of Babel, Templier vs Sorcier, et Prism. Chaque série a son propre univers et style artistique unique."
  },
  {
    id: "follow-updates",
    question: "Comment puis-je suivre les nouvelles créations ?",
    answer: "Vous pouvez suivre les nouvelles créations en vous abonnant à la chaîne YouTube de La Grotte de Juju, en suivant ses réseaux sociaux ou en visitant régulièrement ce site web pour les dernières mises à jour."
  },
  {
    id: "merchandise",
    question: "Y a-t-il des produits dérivés disponibles ?",
    answer: "Les informations sur les produits dérivés et les merchandising seront annoncées sur le site web et les réseaux sociaux. Restez à l'écoute pour les futures collections."
  },
  {
    id: "content-sharing",
    question: "Puis-je réutiliser ou partager le contenu de La Grotte de Juju ?",
    answer: "Tout le contenu de La Grotte de Juju est protégé par des droits d'auteur. Vous pouvez partager les liens vers le contenu original, mais la réutilisation des œuvres nécessite une autorisation explicite du créateur."
  },
];

export function FaqSection() {
  return (
  <section className="py-20 bg-transparent dark:bg-transparent" style={{ contentVisibility: 'auto', containIntrinsicSize: '500px' }}>
      <div className="container px-4 md:px-6">
        <AnimateOnScroll animation="depth-push">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl title-font">
              Questions Fréquemment Posées
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Vous avez des questions sur La Grotte de Juju ? Voici quelques réponses pour vous aider.
            </p>
          </div>
        </AnimateOnScroll>
        
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll animation="elastic-scale" delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-lg font-medium text-left py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
