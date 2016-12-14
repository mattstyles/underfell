
import {render} from 'inferno-dom'

import {signal} from 'signals/main'
import MainView from 'views/main/main'

// Import services and updaters
import 'core/service'
import 'core/updates'

const App = ({state}) => {
  return (
    <MainView {...state} />
  )
}

let main = document.querySelector('.js-main')

signal.observe(state => {
  render(<App state={state} />, main)
}, error => {
  console.error('signal error')
  console.error(error)
})
