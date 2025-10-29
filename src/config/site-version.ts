// Source unique de la version du site
// Priorité: variable d'environnement (build) sinon valeur par défaut actuelle.
export const SITE_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "testchannel-verbêta-1.12.0";

export default SITE_VERSION;
