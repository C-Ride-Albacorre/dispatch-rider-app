import Button from '@/components/ui/buttons/button';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AppleButton() {
  const { Colors } = useTheme();

  return (
    <Button
      size="lg"
      variant="inverted"
      leftIcon={<Ionicons name="logo-apple" size={20} color={Colors.background} />}
    >
      Continue with Apple
    </Button>
  );
}
