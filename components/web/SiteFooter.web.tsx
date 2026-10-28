import { View, type ViewProps } from "react-native";
import { getAppVersion } from "@/components/AppVersionFooter";
import { useI18n } from "@/i18n/I18nProvider";

export function FooterPageContent({ style, ...props }: ViewProps) {
  return <View {...props} style={[style, { flexGrow: 1 }]} />;
}

export function footerTopicDataSet(): Record<string, unknown> {
  return { dataSet: { siteFooterTopic: "true" } };
}

export default function SiteFooter() {
  const { t } = useI18n();
  return <footer className="sf-site-footer" role="contentinfo">
    <div className="sf-site-footer-inner">
      <div>
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
    </div>
  </footer>;
}
