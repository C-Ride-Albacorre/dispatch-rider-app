import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

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
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        <View style={styles.noReviews}>
          <Ionicons name="chatbubble-ellipses-outline" size={scale(24)} color={Colors.textSecondary} />
          <Text style={styles.noReviewsText}>No reviews yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.reviewSection}>
      <Text style={styles.sectionTitle}>Recent Reviews</Text>

      <View style={styles.reviewList}>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewContent}>
              <Text style={styles.reviewAuthor}>{review.author}</Text>

              <Text style={styles.reviewText}>{review.text}</Text>

              <Text style={styles.reviewTime}>{review.time}</Text>
            </View>

            <View style={styles.reviewRating}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < review.rating ? 'star' : 'star-outline'}
                  size={scale(16)}
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
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    reviewSection: {
      gap: scale(12),
    },

    reviewList: {
      gap: scale(16),
    },
    reviewItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scale(8),
      padding: scale(12),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: Colors.border,
    },
    reviewContent: {
      flex: 1,
      gap: scale(4),
    },
    reviewAuthor: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },
    reviewText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.text,
    },
    reviewTime: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandRegular,
      color: Colors.text,
    },
    reviewRating: {
      flexDirection: 'row',
      gap: scale(4),
    },


    noReviews: {
      flexDirection: 'column',
      alignItems: 'center',

        gap: scale(8),

    },
    noReviewsText: {
      fontSize: normalize(12),
        fontFamily: Fonts.brandRegular,

        color: Colors.textSecondary,
    },
  });
