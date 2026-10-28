import { HeaderBackButton } from "@react-navigation/elements";
import { usePathname, useRouter } from "expo-router";
import { Platform, Text } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { matchLocalizedRoute } from "@/i18n/routes";

export const interiorNavigationAppearance = Platform.OS === "web" ? {
  headerStyle: { backgroundColor: "#f5f3ec" },
  headerTintColor: "#426351",
  headerShadowVisible: false,
  headerTitle: TopicFaqHeaderTitle,
} : {};

export const interiorNavigationOptions = Platform.OS === "web" ? {
  ...interiorNavigationAppearance,
  headerLeft: (props: { tintColor?: string }) => <InteriorHomeBackButton {...props} />,
} : {};

function InteriorHomeBackButton({ tintColor }: { tintColor?: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const pagePath = useInformationPagePath();
  const homePath = pagePath("home");
  return <HeaderBackButton href={homePath} tintColor={tintColor} displayMode="minimal"
    accessibilityLabel={t("navigation", "backHome")} onPress={() => router.replace(homePath)} />;
}

export function TopicFaqBackButton({ tintColor }: { tintColor?: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const pagePath = useInformationPagePath();

  return (
    <HeaderBackButton
      href={pagePath("faq")}
      tintColor={tintColor}
      displayMode="minimal"
      accessibilityLabel={t("faqUi", "backToFaq")}
      onPress={() => router.navigate(pagePath("faq"))}
    />
  );
}

export function TopicFaqHeaderTitle({ children }: { children: string }) {
  // React Navigation invokes headerTitle as a callback, not as a component.
  // Keep hooks in a child component when page options replace that callback.
  return <TopicFaqTitleContent>{children}</TopicFaqTitleContent>;
}

function TopicFaqTitleContent({ children }: { children: string }) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const section = Platform.OS === "web" ? matchLocalizedRoute(pathname) : null;
  const shortSection = section === "history" || section === "about" || section === "sources" || section === "centers"
    ? t("landingEditorial", section)
    : section === "faq" || section === "contact" || section === "privacy" || section === "legal"
      ? t("navigation", section)
    : null;
  // Static navigation can supply the route name before page options are applied.
  const page = locale === "en" && children.startsWith("en/")
    ? matchLocalizedRoute(`/${children}`) : null;
  const title = !page ? children
    : page === "home" ? t("common", "brand")
    : page === "swifts" ? t("faqTopics", "vencejosHeading")
    : page === "bats" ? t("faqTopics", "murcielagosHeading")
    : t("navigation", page);
  return (
    <>
      {Platform.OS === "web" ? (
        <style>{`
div:has(> [data-testid="sos-navigation-title"]) { flex-shrink:1; min-width:0; }
@media (max-width:320px) {
 [data-testid="sos-navigation-title"] { white-space:normal; overflow:visible; text-overflow:clip; line-height:18px; }
}`}</style>
      ) : null}
      <Text testID="sos-navigation-title" numberOfLines={1} style={shortSection
        ? { color: "#426351", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 14, fontWeight: "400" }
        : { color: "#1f2937", fontSize: 18, fontWeight: "500" }}>
        {shortSection ?? title}
      </Text>
    </>
  );
}
