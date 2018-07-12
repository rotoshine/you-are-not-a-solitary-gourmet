import { action, observable } from 'mobx'
import { subscribeTodayParties } from '../utils/party'

export default class PartyStore implements IPartyStore {
  @observable parties: Party[] = []

  @action initializeParties() {
    subscribeTodayParties((parties: Party[]) => {
      this.parties = [...parties]
    })
  }
}
