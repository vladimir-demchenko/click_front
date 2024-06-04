import { MainPage } from 'pages/MainPage';
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


createRoot(document.getElementById('root') as HTMLDivElement).render(
  <QueryClientProvider client={queryClient}>
    <MainPage />
  </QueryClientProvider>
)