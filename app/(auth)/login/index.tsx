// import { Image, Text, View } from 'react-native';

import { Text, View } from 'react-native';

// export default function Login() {
//   return (
//     <View>
//       <AuthMethod />

//       <form className="space-y-5" action={action}>
//         {/* Pass callbackUrl through so the action can redirect back */}
//         <input type="hidden" name="callbackUrl" value={callbackUrl} />

//         {method === 'phone' ? (
//           <PhoneInput
//             id="identifier"
//             name="identifier"
//             value={fields.identifier}
//             onChange={handleChange('identifier')}
//             errorMessage={isError ? state.errors?.identifier?.[0] : undefined}
//           />
//         ) : (
//           <Input
//             name="identifier"
//             type="email"
//             label="Email Address"
//             value={fields.identifier}
//             onChange={handleChange('identifier')}
//             errorMessage={isError ? state.errors?.identifier?.[0] : undefined}
//           />
//         )}

//         <div>
//           <Input
//             name="password"
//             type={showPassword ? 'text' : 'password'}
//             label="Password"
//             spacing="sm"
//             value={fields.password}
//             onChange={handleChange('password')}
//             errorMessage={isError ? state.errors?.password?.[0] : undefined}
//             rightIcon={
//               <IconButton
//                 type="button"
//                 rounded="none"
//                 variant="gray"
//                 size="none"
//                 ariaLabel="Toggle password visibility"
//                 onClick={() => setShowPassword((v) => !v)}
//                 className="text-neutral-500 cursor-pointer"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </IconButton>
//             }
//           />

//           <Link
//             href="/reset"
//             className="mt-4 text-sm text-right block text-primary"
//           >
//             Forgot Password?
//           </Link>
//         </div>

//         <Button
//           type="submit"
//           size="full"
//           variant="primary"
//           loading={pending}
//           disabled={pending}
//           className="mt-4"
//         >
//           {pending ? 'Logging in...' : 'Login'}
//         </Button>
//       </form>
//     </View>
//   );
// }

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-white text-xl">Login</Text>
    </View>
  );
}
