import * as React from 'react'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

type Props = {
  partyStore: IPartyStore,
  userStore: IUserStore,
}

const MyPartyItem = styled.div`
  padding: 10px;
  border-radius: 6px;
  min-height: 200px;
  box-shadow: 0px 4px 16px 2px #6666663b;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(0.98);
    box-shadow: 0px 4px 16px 2px #6666663b;
  }
`

const InlineList = styled.li`
  display: inline-block;
`

@inject((rootStore: IRootStore) => ({
  userStore: rootStore.userStore as IUserStore,
  partyStore: rootStore.partyStore as IPartyStore,
}))
@observer
class MyPage extends React.Component<Props> {
  componentDidMount() {
    this.initialize()
  }

  async initialize() {
    const { userStore, partyStore } = this.props

    if (userStore.isExistUser) {
      await partyStore.fetchMyCreatedParties(userStore.user!.email)
    }
  }

  render() {
    const { partyStore } = this.props
    const { myCreatedParties, myCreatedPartiesFetchStatus } = partyStore

    return (
      <div className="MyPage container">
        <h3>내가 만들었던 파티</h3>
        <div className="row">
          {myCreatedPartiesFetchStatus === 'PENDING' && 'Loading..'}
          <ul className="list-inline">
            {myCreatedParties && myCreatedParties.map((party: Party) => (
              <InlineList className="col-xs-12 col-sm-6 col-md-4" key={party.id}>
                <MyPartyItem>
                  {party.title}
                </MyPartyItem>
              </InlineList>
            ))}
          </ul>
        </div>
        <h3>내가 참여한 파티</h3>
      </div>
    )
  }
}

export default MyPage
