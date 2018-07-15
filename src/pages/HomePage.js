import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Switch, Route } from 'react-router-dom'

import PartyListContainer from '../containers/PartyListContainer'
import MakePartyContainer from '../containers/MakePartyContainer'

import PartyDetail from '../PartyDetail'

/*
type Props = {
  userStore: IUserStore,
  partyStore: IPartyStore,
}

type State = {
  isOpen: boolean,
}
*/

@inject('userStore')
@observer
class HomePage extends React.Component {
  state = {
    isOpen: false,
  }

  componentDidUpdate() {

  }

  handleClick = () => {
    const { isExistUser } = this.props.userStore

    if (!isExistUser) {
      alert('로그인이 필요합니다!')
    } else {
      this.setState({ isOpen: true })
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const { isExistUser } = this.props.userStore

    return (
      <div className="HomePage">
        {isExistUser && (
          <button
            className="App__button make"
            onClick={this.handleClick}
          >
            파티만들기
          </button>)
        }
        <Switch>
          <Route
            path="/parties/new"
            render={() => {
              <MakePartyContainer onClose={this.handleClose}/>
            }}
          />
          <Route
            path="/parties/:partyId"
            render={({ match }) => (
              <PartyDetail
                party={find(parties, { 'id': match.params.partyId })}
                parties={parties}
                renderMemberLimit={this.renderMemberLimit}
                renderPartyJoinButton={this.renderPartyJoinButton}
                user={user}
                handleClose={this.handleClose}
                onJoinParty={this.handleJoinPartyClick}
                onLeaveParty={onLeaveParty}
              />
            )}
          />          
        </Switch>        
        <PartyListContainer />
      </div>
    )
  }
}

export default HomePage
