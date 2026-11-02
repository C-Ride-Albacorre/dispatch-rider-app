import IconButton from '@/components/ui/buttons/icon-button';
import { useRouter } from 'expo-router';

export default function ReturnButton() {
  const router = useRouter();

  return (
    <IconButton
      icon="chevron-back"
      size="md"
      onPress={() => router.back()}
      accessibilityLabel="Go back"
    />
  );
}
