
import {render} from 'inferno-dom'

import {signal} from 'signals/main'
import MainView from 'views/main/main'

const App = state => {
  return (
    <MainView />
  )
}

let main = document.querySelector('.js-main')

signal.observe(state => {
  render(<App state={state} />, main)
})
