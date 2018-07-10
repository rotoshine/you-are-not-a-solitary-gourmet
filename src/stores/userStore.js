import { action, observable } from 'mobx'
import { loadCurrentUser, handleSignOut } from '../utils/userUtils';

class UserStore {
  @observable user = null

  @action async initializeUser() {
    this.user = await loadCurrentUser()
  }

  @action async signOut() {
    await handleSignOut()
  }
}

export default new UserStore()
