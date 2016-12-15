
import {BLOCK_SIZE} from 'core/constants/game'

const entityMapper = {
  'char': {
    color: 'rgb(218, 212, 94)',
    gfx: '@'
  },
  'def': {
    color: '#888',
    gfx: '~'
  }
}

const getEntity = id => {
  let entity = entityMapper[id]
  return entity || entityMapper['def']
}

const Entities = ({entities}) => {
  let e = entities
    .map(entity => Object.assign(getEntity(entity.id), {
      position: entity.position
    }))
    .map((entity, i) => {
      let style = {
        color: entity.color,
        left: entity.position[0] * BLOCK_SIZE.WIDTH,
        top: entity.position[1] * BLOCK_SIZE.HEIGHT
      }
      return (
        <span
          key={`entity${i}`}
          className='Entity'
          style={style}
        >
          {entity.gfx}
        </span>
      )
    })

  return <div>{e}</div>
}

export default Entities
