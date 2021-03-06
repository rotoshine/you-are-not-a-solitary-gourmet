import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import PartyListPage from './pages/PartyListPage'
import PartyFormPage from './pages/PartyFormPage'
import PartyDetailPage from './pages/PartyDetailPage'

import AuthenticateHeader from './AuthenticateHeader'
import Footer from './Footer'

import { unsubscribeDestinations } from './utils/destination'

import './App.css'

interface Props { }
interface InjectedProps extends Props {
  destinationsStore: IDestinationsStore,
  partyStore: IPartyStore,
}

@inject((allStores: IAllStore) => ({
  destinationsStore: allStores.destinationsStore as IDestinationsStore,
  partyStore: allStores.partyStore as IPartyStore,
}))
@observer
class App extends React.Component<Props> {
  componentDidMount() {
    const { destinationsStore } = this.props as InjectedProps

    destinationsStore.initializeDestinations()
  }

  componentWillUnmount() {
    unsubscribeDestinations()
  }

  render() {
    const { partyStore } = this.props as InjectedProps
    const { categories } = partyStore

    return (
      <div className="App">
        <AuthenticateHeader />
        <Router>
          {categories &&
            <React.Fragment>
              <Route
                path="/"
                component={PartyListPage}
              />
              <Switch>
                <Route
                  path="/parties/new"
                  component={PartyFormPage}
                  exact
                />
                <Route
                  path="/parties/:partyId"
                  component={PartyDetailPage}
                  exact
                />
                <Route
                  path="/parties/:partyId/edit"
                  component={PartyFormPage}
                  exact
                />
              </Switch>
            </React.Fragment>
          }
        </Router>
        <Footer />
      </div>
    )
  }
}

export default App
