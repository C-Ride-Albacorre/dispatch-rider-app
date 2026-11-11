import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

let globalQueryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!globalQueryClient) {
    globalQueryClient = new QueryClient();
  }
  return globalQueryClient;
}

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => {
    globalQueryClient = new QueryClient();
    return globalQueryClient;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
