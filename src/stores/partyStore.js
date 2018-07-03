import { action, observable } from 'mobx'
import { subscribeTodayParties } from '../utils/partyUtils'

class PartyStore {
  @observable parties = []

  @action initializeParties() {
    subscribeTodayParties((parties) => {
      this.parties = [...this.parties, ...parties]
    })
  }
}

export default new PartyStore()
