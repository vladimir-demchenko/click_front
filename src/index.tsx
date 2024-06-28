import { MainPage } from 'pages/MainPage';
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from 'App';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient()


createRoot(document.getElementById('root') as HTMLDivElement).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
)