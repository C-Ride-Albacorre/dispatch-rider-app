import Button from '@/components/ui/buttons/button';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function GoogleButton() {
  const { Colors } = useTheme();

  return (
    <Button
      size="lg"
      leftIcon={<Ionicons name="logo-google" size={20} color={Colors.white} />}
      variant="google"
    >
      Continue with Google
    </Button>
  );
}
