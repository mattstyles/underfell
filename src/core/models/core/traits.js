
import {BLOCK_STATES} from 'core/constants/game'
import {addMasks} from 'core/utils/bitmask'

const mineable = (entity, cell) => {
  // @TODO should emit a signal action
  console.log('You try to mine with your bare hands, not much happens.')
}

const noisyFloor = (entity, cell) => {
  console.log('The floor is noisy under your feet.')
}

const squeekyFloor = (entity, cell) => {
  console.log('The floor squeaks as you step off of it.')
}

export default [
  {
    id: 'core:solid',
    state: addMasks(0)(
      BLOCK_STATES.OPAQUE,
      BLOCK_STATES.SOLID
    )
  },
  {
    id: 'core:mineable',
    onCollision: mineable
  },
  {
    id: 'core:noisy_floor',
    onEnter: noisyFloor,
    onExit: squeekyFloor
  }
]
