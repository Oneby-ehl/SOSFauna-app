import { Stack, usePathname } from "expo-router";

import AboutPage from "@/components/home/AboutPage";
import ContactPage from "@/components/home/ContactPage";
import Home from "@/components/home/Home";
import HistoryPage from "@/app/history";
import LegalPage from "@/components/home/LegalPage";
import PrivacyPage from "@/components/home/PrivacyPage";
import SourcesPage from "@/components/home/SourcesPage";
import AvisoRoute from "@/app/aviso";
import CentrosRoute from "@/app/centros";
import FaqPage from "@/components/faq/FaqPage";
import TopicFaqPage from "@/components/faq/TopicFaqPage";
import { getEnglishDevelopmentPage } from "@/i18n/developmentPreview";

const pages = {
  home: Home,
  history: HistoryPage,
  about: AboutPage,
  sources: SourcesPage,
  contact: ContactPage,
  privacy: PrivacyPage,
  legal: LegalPage,
  guide: AvisoRoute,
  centers: CentrosRoute,
  faq: FaqPage,
  swifts: () => <TopicFaqPage topicId="vencejos" />,
  bats: () => <TopicFaqPage topicId="murcielagos" />,
} as const;

// Loaded by +not-found only in a web development bundle, never by public routes.
export default function EnglishDevelopmentPreview() {
  const pathname = usePathname();
  const page = getEnglishDevelopmentPage(pathname, "web");
  if (!page) return null;
  const Page = pages[page];
  return <><Stack.Screen options={{ headerShown: page !== "home" }} /><Page /></>;
}
