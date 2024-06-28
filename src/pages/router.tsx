import { Route, Routes } from 'react-router-dom'
import { ProxyPage } from './ProxyPage'
import { MainPage } from './MainPage'

export const AppRouter = () => {
  return <Routes>
    <Route
      path={'/'}
      element={<MainPage />}
    />
    <Route
      path={`/:id`}
      element={<ProxyPage />}
    />
  </Routes>
}