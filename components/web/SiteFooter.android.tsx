import { View, type ViewProps } from "react-native";
import AndroidFooter from "@/components/AndroidFooter";

export default function SiteFooter() { return <AndroidFooter safeBottom />; }
export function FooterPageContent({ style, ...props }: ViewProps) {
  return <View {...props} style={[style, { flexGrow: 1 }]} />;
}
export function footerTopicDataSet(): Record<string, unknown> { return {}; }
