import { observable, action } from 'mobx'
import { subscribeTodayParties } from '../utils/party'

export default class PartyStore implements IPartyStore {
  @observable parties: (Party[] | null) = null
  @observable initializedParty = false

  @action
  initializeParties = () => {
    subscribeTodayParties((parties: Party[]) => {
      this.parties = [...parties]

      this.initializedParty = true
    })
  }
}
