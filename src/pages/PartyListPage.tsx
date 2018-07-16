import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import PartyList from '../PartyList'

import { unsubscribeTodayParties } from '../utils/party'

type Props = {
  partyStore?: IPartyStore,
  userStore?: IUserStore,
}

@inject((allStores: IAllStore) => ({
  userStore: allStores.userStore as IUserStore,
  partyStore: allStores.partyStore as IPartyStore,
}))
@observer
class PartyListPage extends React.Component<Props> {
  componentDidMount() {
    this.initializeParties()
  }

  componentWillUnmount() {
    unsubscribeTodayParties()
  }

  async initializeParties() {
    const { initializeParties } = this.props.partyStore!

    initializeParties()
  }

  render() {
    const { user } = this.props.userStore!
    const { initializedParty, parties } = this.props.partyStore!

    return (
      <div className="PartyListContainer App__contents container album py-5">
        {
          !initializedParty && (
            <h3 className="App__text-black">파티를 불러오는 중</h3>
          )
        }
        {
          initializedParty && parties && (
            <h3 className="App__text-black">
              다가오는 파티 <span role="img" aria-label="eyes">👀</span>
            </h3>
          )
        }

        {initializedParty && parties && (
          <React.Fragment>
            <PartyList
              user={user}
              parties={parties}
            />
            <Link to="/parties/new">
              <button className="App__button make">파티만들기</button>
            </Link>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default PartyListPage
