import PartyStore from './PartyStore'
import UserStore from './UserStore'
import DestinationsStore from './DestinationsStore'

const stores = {
  partyStore: new PartyStore(),
  userStore: new UserStore(),
  destinationsStore: new DestinationsStore(),
}

export default stores
