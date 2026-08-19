import CustomToast from "./custom-toast";


export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <CustomToast
      type="success"
      title={text1}
      message={text2}
    />
  ),

  error: ({ text1, text2 }: any) => (
    <CustomToast
      type="error"
      title={text1}
      message={text2}
    />
  ),

  warning: ({ text1, text2 }: any) => (
    <CustomToast
      type="warning"
      title={text1}
      message={text2}
    />
  ),

  info: ({ text1, text2 }: any) => (
    <CustomToast
      type="info"
      title={text1}
      message={text2}
    />
  ),
};