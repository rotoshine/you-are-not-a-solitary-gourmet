import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import * as firebase from 'firebase';

import App from './App'
import registerServiceWorker from './registerServiceWorker'

require('dotenv').config()

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID
} = process.env

firebase.initializeApp({
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
  projectId: REACT_APP_FIREBASE_PROJECT_ID
})

window.firebase = firebase

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker();
