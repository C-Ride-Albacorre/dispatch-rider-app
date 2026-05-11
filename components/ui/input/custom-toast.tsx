import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#22c55e',
        backgroundColor: '#dcfce7',
        borderRadius: 16,
        borderLeftWidth: 0,
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '700',
        color: '#166534',
      }}
      text2Style={{
        fontSize: 13,
        color: '#166534',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ef4444',
        backgroundColor: '#fee2e2',
        borderRadius: 16,
        borderLeftWidth: 0,
        paddingVertical: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '700',
        color: '#991b1b',
      }}
      text2Style={{
        fontSize: 13,
        color: '#991b1b',
      }}
    />
  ),
};
