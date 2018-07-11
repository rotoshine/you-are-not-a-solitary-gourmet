import { action, observable } from 'mobx'
import { subscribeDestinations } from '../utils/destination'

class DestinationsStore {
  @observable destinations = {}

  @action initializeDestinations() {
    subscribeDestinations((destinations) => {
      console.log('receive', destinations)
      this.destinations = [...destinations]
    })
  }
}

export default new DestinationsStore()
