import type { ComponentProps } from "react";
import type MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export type InterfaceIconProps = {
  name: ComponentProps<typeof MaterialCommunityIcons>["name"];
  size?: number;
  color?: string;
};
export type InterfaceLabelProps = { text: string; icon?: InterfaceIconProps["name"]; color?: string };

// Other platforms retain the exact original copy and presentation.
export function InterfaceIcon(_props: InterfaceIconProps) { return null; }
export function InterfaceLabel({ text }: InterfaceLabelProps) { return <>{text}</>; }
