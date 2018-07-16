import { observable, action } from 'mobx'
import { subscribeTodayParties, findByCreatedByEmail } from '../utils/party'

export default class PartyStore implements IPartyStore {
  @observable parties: (Party[] | null) = null
  @observable initializedParty = false
  @observable myCreatedParties: (Party[] | null) = null
  @observable myCreatedPartiesFetchStatus: string = 'PENDING'

  @action
  initializeParties = () => {
    subscribeTodayParties((parties: Party[]) => {
      this.parties = [...parties]
      this.initializedParty = true
    })
  }

  @action
  fetchMyCreatedParties = async (email: string) => {
    this.myCreatedPartiesFetchStatus = 'PENDING'

    try {
      const myCreatedParties = await findByCreatedByEmail(email)
      this.myCreatedPartiesFetchStatus = 'SUCCESS'
      this.myCreatedParties = [...myCreatedParties]
    } catch (e) {
      console.log(e)
      this.myCreatedPartiesFetchStatus = 'FAIL'
    }
  }
}
