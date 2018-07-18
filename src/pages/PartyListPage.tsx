import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

import PartyList from '../PartyList'

import { unsubscribeTodayParties } from '../utils/party'

import { Categories, CategoryBlock } from '../PartyStyledComponents'

type Props = {
  partyStore?: IPartyStore,
  userStore?: IUserStore,
}
@inject((rootStore: IRootStore) => ({
  userStore: rootStore.userStore as IUserStore,
  partyStore: rootStore.partyStore as IPartyStore,
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
            <React.Fragment>
              <h3 className="App__text-black">
              다양한 컨셉의 파티를 알아보세요! <span role="img" aria-label="eyes">👀</span>
              </h3>
              <Categories>
                <CategoryBlock color="#fd7e14">
                  <span>
                    <Link to="/parties/new">
                      파티만들기
                    </Link>
                  </span>
                </CategoryBlock>
                {parties.map(party => (
                  <CategoryBlock color="white">
                    <span>{party.category}</span>
                  </CategoryBlock>
                ))}
              </Categories>
            </React.Fragment>
          )
        }

        {initializedParty && parties && (
          <React.Fragment>
            <div className="APP_text-group">
              <h3
                className="App__text-black">
                  다가오는 파티 <span role="img" aria-label="eyes">👀</span>
              </h3>
              <PartyList
                user={user}
                parties={parties}
              />
            </div>
            <div className="APP_text-group">
              <h3
                className="App__text-black">
                지나간 파티 <span role="img" aria-label="eyes">😢</span>
              </h3>
              <PartyList
                user={user}
                parties={parties}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default PartyListPage
