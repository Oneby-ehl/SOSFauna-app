import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { fauna } from "@/constants/androidPresentation";
import { useI18n } from "@/i18n/I18nProvider";
import { shareSosFaunaApp } from "@/utils/rescueShareMessage";
import type { HomeMenuProps } from "./HomeChrome";

export function HomeMenu({ checkingCase, onGuide, onContinue }: HomeMenuProps) {
  const { t, locale } = useI18n();
  const path = useInformationPagePath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  // Close the native menu before opening a destination or an existing Alert.
  useEffect(() => {
    if (open || !pendingAction.current) return;
    const frame = requestAnimationFrame(() => {
      const action = pendingAction.current;
      pendingAction.current = null;
      action?.();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const close = () => {
    pendingAction.current = null;
    setOpen(false);
  };
  const choose = (action: () => void) => {
    pendingAction.current = action;
    setOpen(false);
  };
  const groups = [
    [
      { key: "home", label: t("landingEditorial", "home"), action: () => {} },
      { key: "guide", label: t("navigation", "guide"), action: onGuide, disabled: checkingCase },
      ...(onContinue ? [{ key: "continue", label: t("navigation", "continueCase"), action: onContinue }] : []),
      { key: "history", label: t("landingEditorial", "history"), action: () => router.push(path("history")) },
    ],
    [
      { key: "faq", label: t("navigation", "faq"), action: () => router.push(path("faq")) },
      { key: "centers", label: t("landingEditorial", "centers"), action: () => router.push(path("centers")) },
    ],
    [
      { key: "about", label: t("landingEditorial", "about"), action: () => router.push(path("about")) },
      { key: "sources", label: t("landingEditorial", "sources"), action: () => router.push(path("sources")) },
      { key: "contact", label: t("navigation", "contact"), action: () => router.push(path("contact")) },
      { key: "privacy", label: t("navigation", "privacy"), action: () => router.push(path("privacy")) },
      { key: "legal", label: t("navigation", "legal"), action: () => router.push(path("legal")) },
      { key: "share", label: t("navigation", "shareApp"), action: () => { void shareSosFaunaApp(locale); } },
    ],
  ];

  return <>
    <Pressable accessibilityRole="button" accessibilityLabel={t("landingEditorial", "menu")}
      accessibilityState={{ expanded: open }} onPress={() => setOpen(true)} style={styles.trigger}>
      <MaterialIcons name="menu" size={26} color={fauna.paper} accessible={false} />
    </Pressable>
    <Modal visible={open} transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={close}>
      <SafeAreaProvider style={styles.overlay}>
        <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={close} />
        <SafeAreaView pointerEvents="box-none" style={styles.safeMenu} edges={["top", "bottom", "left", "right"]}>
          <View style={styles.panel} accessibilityViewIsModal onAccessibilityEscape={close}>
            <View style={styles.menuHeader}>
              <Text accessibilityRole="header" style={styles.menuTitle}>{t("landingEditorial", "menu")}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={t("landingEditorial", "close")} onPress={close} style={styles.close}>
                <MaterialIcons name="close" size={24} color={fauna.forest} accessible={false} />
              </Pressable>
            </View>
            <ScrollView accessibilityLabel={t("landingEditorial", "navigation")} contentContainerStyle={styles.menuContent}>
              {groups.map((items, index) => <View key={index} style={[styles.group, index > 0 && styles.divider]}>
                {items.map(item => <Pressable key={item.key} accessibilityRole="button"
                  accessibilityState={{ selected: item.key === "home", disabled: "disabled" in item && item.disabled === true }}
                  disabled={"disabled" in item && item.disabled === true} onPress={() => choose(item.action)}
                  style={({ pressed }) => [styles.item, item.key === "home" && styles.currentItem,
                    "disabled" in item && item.disabled === true && styles.disabled, pressed && styles.pressed]}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </Pressable>)}
              </View>)}
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  </>;
}

export { default as HomeFooter } from "@/components/AndroidFooter";

const styles = StyleSheet.create({
  trigger: { width: 48, height: 48, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  overlay: { flex: 1, backgroundColor: "rgba(5,21,16,0.48)" },
  safeMenu: { flex: 1, alignItems: "flex-start" },
  panel: { flex: 1, width: "100%", maxWidth: 360, backgroundColor: fauna.paper, borderTopRightRadius: 16, borderBottomRightRadius: 16, overflow: "hidden" },
  menuHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 20, paddingRight: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: fauna.border },
  menuTitle: { color: fauna.forest, fontFamily: "serif", fontSize: 26, lineHeight: 34 },
  close: { minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center" },
  menuContent: { padding: 12, gap: 10 },
  group: { gap: 2 },
  divider: { borderTopWidth: 1, borderTopColor: fauna.outline, paddingTop: 10 },
  item: { minHeight: 48, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, justifyContent: "center" },
  currentItem: { backgroundColor: fauna.sage },
  disabled: { opacity: 0.5 },
  pressed: { backgroundColor: "#e1e6d9" },
  itemText: { color: fauna.ink, fontSize: 16, lineHeight: 24, flexShrink: 1 },
});
