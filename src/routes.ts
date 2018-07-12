import App from './App'
import HomePage from './pages/HomePage'
import PageNotFound from './PageNotFound'

export const appRoutes = [
  {
    id: 'HomePage',
    component: HomePage,
    path: '/',
    exact: true,
  },
]

export const rootRoute = [
  {
    id: 'App',
    component: App,
    path: '/',
    exact: true,
  },
  {
    id: '403',
    component: PageNotFound,
    path: null,
  },
]
