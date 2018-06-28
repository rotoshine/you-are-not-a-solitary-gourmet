import './index.css'

import 'moment/locale/ko'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import App from './App'
import registerServiceWorker from './registerServiceWorker'
import stores from './stores'

import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render((
  <Provider {...stores}>
    <App />
  </Provider>
), document.getElementById('root'))
registerServiceWorker();
