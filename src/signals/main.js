
import {Signal} from 'raid'
import {adaptor} from 'raid-addons'

import {GAME_STATES} from 'core/actions/global'
import {generate} from 'core/service/map'

const WIDTH = 64
const HEIGHT = 32

export const signal = new Signal({
  name: 'Raid',
  gameState: GAME_STATES.RUNNING,
  entities: [
    {
      id: 'char',
      position: [1, 1]
    }
  ],
  map: generate(WIDTH, HEIGHT)
})

export const connect = adaptor(signal)
