import * as React from 'react'
import { signIn } from './utils/user'

export default class GoogleLoginButton extends React.Component {
  render () {
    return (
      <button
        className="App__button nav-link"
        onClick={() => signIn()}
      >
        로그인
      </button>
    )
  }
}
