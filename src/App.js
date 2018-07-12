import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import PartyList from './PartyList'
import MakeParty from './MakeParty'
import AuthenticateHeader from './AuthenticateHeader'

import { appRoutes } from './routes'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AuthenticateHeader/>
          {appRoutes.map(route => (
            <Route
              key={route.path}
              exact={route.exact}
              path={route.path}
              component={route.component}
            />
          ))}
      </div>
    )
  }
}

export default App
