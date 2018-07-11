import { action, observable } from 'mobx'
import { subscribeDestinations } from '../utils/destination'

class DestinationsStore {
  @observable destinations = {}

  @action initializeDestinations() {
    subscribeDestinations((destinations) => {      
      this.destinations = [...destinations]
    })
  }
}

export default new DestinationsStore()
