import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const REVIEWS: any[] = [
//   {
//     id: '1',
//     author: 'Adebayo W.',
//     text: 'Excellent service! Very professional.',
//     time: '2 hours ago',
//     rating: 5,
//   },
//   {
//     id: '2',
//     author: 'Jane D.',
//     text: 'Good delivery, but the driver was a bit late.',
//     time: '1 day ago',
//     rating: 4,
//   },
//   {
//     id: '3',
//     author: 'John S.',
//     text: 'Package arrived damaged. Not happy with the service.',
//     time: '3 days ago',
//     rating: 2,
//   },
//   {
//     id: '4',
//     author: 'Emily R.',
//     text: 'Fast and reliable service. Highly recommend!',
//     time: '5 days ago',
//     rating: 5,
//   },
];

export default function Reviews() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  if (REVIEWS.length === 0) {
    return (
      <View style={styles.reviewSection}>
        <ThemedText style={styles.sectionTitle}>Recent reviews</ThemedText>
        <View style={styles.noReviews}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={Colors.textMuted}
          />
          <ThemedText style={styles.noReviewsText} themeColor="textMuted">
            No reviews yet
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.reviewSection}>
      <ThemedText style={styles.sectionTitle}>Recent reviews</ThemedText>

      <View style={styles.reviewList}>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewContent}>
              <ThemedText style={styles.reviewAuthor}>{review.author}</ThemedText>

              <ThemedText style={styles.reviewText} themeColor="textSecondary">
                {review.text}
              </ThemedText>

              <ThemedText style={styles.reviewTime} themeColor="textMuted">
                {review.time}
              </ThemedText>
            </View>

            <View style={styles.reviewRating}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < review.rating ? 'star' : 'star-outline'}
                  size={16}
                  color={Colors.primary}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    sectionTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    reviewSection: {
      gap: 12,
    },

    reviewList: {
      gap: Spacing.two,
    },

    reviewItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: Spacing.two,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    reviewContent: {
      flex: 1,
      gap: Spacing.one,
    },

    reviewAuthor: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    reviewText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    reviewTime: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    reviewRating: {
      flexDirection: 'row',
      gap: 2,
    },

    noReviews: {
      alignItems: 'center',
      gap: Spacing.two,
      padding: Spacing.four,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
    },

    noReviewsText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },
  });
