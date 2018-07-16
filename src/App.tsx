import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom'

import PartyListPage from './pages/PartyListPage'
import PartyFormPage from './pages/PartyFormPage'
import PartyDetailPage from './pages/PartyDetailPage'
import MyPage from './pages/MyPage'

import AuthenticateHeader from './AuthenticateHeader'
import Footer from './Footer'

import { unsubscribeDestinations } from './utils/destination'

import './App.css'

interface Props { }
interface InjectedProps extends Props {
  userStore: IUserStore,
  destinationsStore: IDestinationsStore,
}

@inject((rootStore: IRootStore) => ({
  userStore: rootStore.userStore as IUserStore,
  destinationsStore: rootStore.destinationsStore as IDestinationsStore,
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
    const { userStore } = this.props as InjectedProps

    return (
      <div className="App">
        <AuthenticateHeader />
        {userStore!.isExistUser &&
          <Router>
            <React.Fragment>
              <Route exact path="/" render={() => (
                <Redirect to="/parties" />
              )}
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
              <Switch>
                <Route
                  path="/parties"
                  component={PartyListPage}
                />
                <Route
                  paht="/me"
                  component={MyPage}
                />
              </Switch>
            </React.Fragment>
          </Router>
        }
        <Footer />
      </div>
    )
  }
}

export default App
