import { action, observable, computed } from 'mobx'
import { isEmpty } from 'lodash'

import { loadCurrentUser, handleSignOut } from '../utils/user'

export default class UserStore {
  @observable user: (User | null) = null

  @computed get isExistUser() {
    return !isEmpty(this.user)
  }

  @action async initializeUser() {
    const user = await loadCurrentUser()

    if (user) {
      this.user = user
    }
  }

  @action async signOut() {
    await handleSignOut()
  }
}
