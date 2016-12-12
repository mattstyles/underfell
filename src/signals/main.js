
import {Signal} from 'raid'
import {adaptor} from 'raid-addons'

import {GAME_STATES} from 'core/actions/global'

export const signal = new Signal({
  name: 'Raid',
  game_state: GAME_STATES.RUNNING,
  position: [0, 0]
})

export const connect = adaptor(signal)
