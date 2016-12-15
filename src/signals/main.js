
import {Signal} from 'raid'
import {adaptor} from 'raid-addons'

import {GAME_STATES} from 'core/constants/game'
import {generate} from 'core/service/map'

const WIDTH = 32
const HEIGHT = 16

export const signal = new Signal({
  name: 'Raid',
  gameState: GAME_STATES.RUNNING,
  entities: [
    {
      id: 'char',
      position: [12, 8]
    }
  ],
  map: generate(WIDTH, HEIGHT)
})

export const connect = adaptor(signal)
