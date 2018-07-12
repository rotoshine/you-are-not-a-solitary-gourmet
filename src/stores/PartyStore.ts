import { action, observable } from 'mobx'
import { subscribeTodayParties } from '../utils/party'

export default class PartyStore implements IPartyStore {
  @observable parties: (Party[] | null) = null
  @observable initialized = false

  @action initializeParties() {
    subscribeTodayParties((parties: Party[]) => {
      if (!this.parties) {
        this.parties = []
      } else {
        this.parties = [...parties]
      }

      this.initialized = true
    })
  }
}
