import { View, type ViewProps } from "react-native";
import { getAppVersion } from "@/components/AppVersionFooter";
import { useI18n } from "@/i18n/I18nProvider";

// Existing Google Play listing used by components/home/LandingPage.tsx.
const GOOGLE_PLAY_APP_URL = "https://play.google.com/store/apps/details?id=com.onebyehl.sosfauna";

export function FooterPageContent({ style, ...props }: ViewProps) {
  return <View {...props} style={[style, { flexGrow: 1 }]} />;
}

export function footerTopicDataSet(): Record<string, unknown> {
  return { dataSet: { siteFooterTopic: "true" } };
}

export default function SiteFooter() {
  const { t, locale } = useI18n();
  const googlePlayAlt = locale === "en"
    ? "Download SOS Fauna España on Google Play"
    : "Descargar SOS Fauna España en Google Play";
  return <footer className="sf-site-footer" role="contentinfo">
    <div className="sf-site-footer-inner">
      <div className="sf-site-footer-intro">
        <p className="sf-site-footer-brand">{t("common", "brandEyebrow")}</p>
        <p className="sf-site-service">{t("home", "footerDescription")}</p>
        <p className="sf-site-service">{t("landingEditorial", "freeService")}</p>
      </div>
      <hr className="sf-site-footer-rule" />
      <p className="sf-site-independence">{t("helpContactDescriptions", "independenceNotice")}</p>
      <div className="sf-site-footer-meta">
        <p>{t("versionFooter", "copyright")}</p>
        <p>Web{t("versionFooter", "versionSeparator")}{getAppVersion()}</p>
      </div>
      <a className="sf-site-footer-play" href={GOOGLE_PLAY_APP_URL} target="_blank" rel="noopener noreferrer">
        <img src="/google-play-badge-es.png" width="160" alt={googlePlayAlt} loading="lazy" decoding="async" />
      </a>
    </div>
  </footer>;
}
