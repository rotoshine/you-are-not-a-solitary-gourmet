import React, { Component } from 'react'
import { signIn } from './utils/userUtils'

export default class GoogleLoginButton extends Component {
  render () {
    return (
      <button className="btn btn-success my-2" type="button" onClick={() => signIn()}>Sign In</button>
    )
  }
}
