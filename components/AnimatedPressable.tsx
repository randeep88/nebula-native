import { Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const AnimatedPressable = ({ onPress, children, style }: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    // ✅ ek hi baar mein down → up, koi ruko nahi
    scale.value = withSequence(
      withSpring(0.97, { damping: 50, stiffness: 2000 }),
      withSpring(1, { damping: 50, stiffness: 2000 }),
    );
    opacity.value = withSequence(
      withTiming(0.75, { duration: 50 }),
      withTiming(1, { duration: 50 }),
    );
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress}>
      {" "}
      {/* ✅ pressIn/Out hata diya */}
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

export default AnimatedPressable;
