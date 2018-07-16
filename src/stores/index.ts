import PartyStore from './PartyStore'
import UserStore from './UserStore'
import DestinationsStore from './DestinationsStore'

const userStore = new UserStore()
const partyStore = new PartyStore()
const destinationsStore = new DestinationsStore()

const stores = {
  partyStore,
  userStore,
  destinationsStore,
}

export default stores
