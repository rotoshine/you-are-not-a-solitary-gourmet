import { action, observable, computed } from 'mobx'
import { isEmpty } from 'lodash'

import { loadCurrentUser, handleSignOut } from '../utils/userUtils';

class UserStore {
  @observable user = null

  @computed get isExsitUser() {
    return !isEmpty(this.user)
  }

  @action async initializeUser() {
    this.user = await loadCurrentUser()
  }

  @action async signOut() {
    await handleSignOut()
  }
}

export default new UserStore()
