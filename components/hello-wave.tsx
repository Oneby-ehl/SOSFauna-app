import Animated from 'react-native-reanimated';
import { Platform } from 'react-native';
import { InterfaceIcon } from '@/components/ui/InterfaceLabel';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      {Platform.OS === 'android' ? <InterfaceIcon name="hand-wave-outline" size={28} /> : '👋'}
    </Animated.Text>
  );
}
