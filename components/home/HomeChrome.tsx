export type HomeMenuProps = {
  checkingCase: boolean;
  onGuide: () => void;
  onContinue?: () => void;
};

// Android supplies its own chrome; other platforms keep their current layout.
export function HomeMenu(_props: HomeMenuProps) { return null; }
export function HomeFooter() { return null; }
