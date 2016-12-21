
import {Signal} from 'raid'
import {adaptor} from 'raid-addons'

import {GAME_STATES, SIZES} from 'core/constants/game'
import {generate} from 'core/service/map'

export const signal = new Signal({
  name: 'Raid',
  gameState: GAME_STATES.RUNNING,
  entities: [
    {
      id: 'char',
      position: [11, 3]
    }
  ],
  map: generate(SIZES.MAP_WIDTH, SIZES.MAP_HEIGHT)
})

export const connect = adaptor(signal)
