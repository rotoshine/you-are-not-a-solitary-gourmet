import { observable, action } from 'mobx'
import { subscribeTodayParties } from '../utils/party'

import categories from '../data/categories'

export default class PartyStore implements IPartyStore {
  @observable initializeCategories: boolean = false
  @observable categories: (Category[]) = categories
  @observable parties: (Party[] | null) = null
  @observable initializedParty: boolean = false

  @action
  initializeParties = () => {
    subscribeTodayParties((parties: Party[]) => {
      this.parties = [...parties]
      this.initializedParty = true
    })
  }
}
