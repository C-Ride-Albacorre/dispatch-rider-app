// import { Phone, Mail } from 'lucide-react';
// import { useAuthMethod } from '@/features/auth/hooks/auth-method.context';

// export default function AuthMethod() {
//   const { method, setMethod } = useAuthMethod();
//   return (
//     <div className="flex rounded-xl bg-neutral-100 p-1 mb-6">
//       <button
//         type="button"
//         onClick={() => setMethod('phone')}
//         className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition cursor-pointer ${
//           method === 'phone' ? 'bg-white shadow' : 'text-neutral-500'
//         }`}
//       >
//         <Phone size={16} /> Phone
//       </button>

//       <button
//         type="button"
//         onClick={() => setMethod('email')}
//         className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition cursor-pointer ${
//           method === 'email' ? 'bg-white shadow' : 'text-neutral-500'
//         }`}
//       >
//         <Mail size={16} /> Email
//       </button>
//     </div>
//   );
// }
