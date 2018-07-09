import React, { Component } from 'react'
import { signIn } from './utils/userUtils'

export default class GoogleLoginButton extends Component {
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
