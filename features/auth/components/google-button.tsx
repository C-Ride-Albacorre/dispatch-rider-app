import Button from '@/components/ui/buttons/button';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function GoogleButton() {
  return (
    <Button
      leftIcon={<Ionicons name="logo-google" size={20} color="#fff" />}
      variant="google"
    >
      Continue with Google
    </Button>
  );
}
