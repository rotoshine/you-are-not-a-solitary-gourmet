import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'

import { Overlay, CenterText } from '../CommonStyledComponents'
import PartyForm from '../PartyForm'

import { asyncSetState } from '../utils/misc'
import { findById, saveParty } from '../utils/party'

type Props = & RouteComponentProps<any> & {
  userStore: IUserStore,
  destinationsStore: IDestinationsStore,
  onClose: () => void,
}

type State = {
  isNowFetching: boolean,
  party: Party | null,
}

@inject((rootStore: IRootStore) => ({
  userStore: rootStore.userStore as IUserStore,
  destinationsStore: rootStore.destinationsStore as IDestinationsStore,
}))
@observer
class PartyFormPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { match } = props
    const { partyId } = match.params

    this.state = {
      isNowFetching: partyId ? true : false,
      party: null,
    }
  }

  async componentDidMount() {
    const { match } = this.props
    const { partyId } = match.params

    if (partyId) {
      const party = await findById(partyId)

      if (party) {
        await asyncSetState(() => this.setState({
          party,
          isNowFetching: false,
        }))
      }
    }
  }

  handleSaveParty = async (partyFormData: PartyFormData) => {
    const { user } = this.props.userStore!
    if (!user) return

    partyFormData.joinners = [
      user.email,
    ]

    await saveParty(partyFormData, user)
  }

  handleClose = () => {
    this.props.history.push('/')
  }

  render() {
    const { isNowFetching, party } = this.state
    const { destinationsStore } = this.props
    const { destinations } = destinationsStore

    if (isNowFetching) {
      return (
        <Overlay>
          <CenterText>
            <h1>파티 내용을<br /> 불러오는 중입니다..</h1>
          </CenterText>
        </Overlay>
      )
    }

    return (
      <PartyForm
        party={party}
        destinations={destinations}
        onSave={this.handleSaveParty}
        onClose={this.handleClose}
      />
    )
  }
}

export default PartyFormPage
