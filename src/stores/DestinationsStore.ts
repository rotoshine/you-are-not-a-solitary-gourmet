import { action, observable } from 'mobx'
import { subscribeDestinations } from '../utils/destination'

export default class DestinationsStore implements IDestinationsStore {
  @observable destinations: Destination[] = []

  @action initializeDestinations() {
    subscribeDestinations((destinations: Destination[]) => {
      this.destinations = [...destinations]
    })
  }
}
