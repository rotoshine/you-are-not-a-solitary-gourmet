import React, { Component } from 'react'
import { Provider } from 'mobx-react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import { rootRoute } from './routes'
import stores from './stores'

const Root = () => (
  <Provider {...stores}>
    <Router>
      <Switch>
        {rootRoute.map(route => (
          <Route
            key={route.id}
            path={route.path}
            component={route.component}
            exact={route.exact}
          />
        ))}
      </Switch>
    </Router>
  </Provider>
)

export default Root
