
import {Signal} from 'raid'
import {adaptor} from 'raid-addons'

import {GAME_STATES, SIZES} from 'core/constants/game'
import {generate} from 'core/service/map'
import {factory} from 'core/models/entities'

export const signal = new Signal({
  name: 'Raid',
  gameState: GAME_STATES.RUNNING,
  entities: [
    factory.create('char', [8, 8]),
    factory.create('light', [2, 2])
  ],
  map: generate(SIZES.MAP_WIDTH, SIZES.MAP_HEIGHT, 'hello')
})

export const connect = adaptor(signal)
