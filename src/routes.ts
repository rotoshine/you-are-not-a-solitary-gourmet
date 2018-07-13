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
  {
    id: 'Parties',
    component: HomePage,
    path: '/parties/:id',
  },
  {
    id: '404',
    component: PageNotFound,
    path: null,
  },
]

export const rootRoute = [
  {
    id: 'App',
    component: App,
    path: '/',
  },
]
