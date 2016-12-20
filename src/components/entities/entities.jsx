
import {SIZES} from 'core/constants/game'

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

const Entities = ({entities, translate}) => {
  let e = entities
    .map(entity => Object.assign(getEntity(entity.id), {
      position: [
        entity.position[0] + translate[0],
        entity.position[1] + translate[1]
      ]
    }))
    .filter(entity => {
      // @TODO only render those entities with visibility
      return true
    })
    .map((entity, i) => {
      let style = {
        color: entity.color,
        left: entity.position[0] * SIZES.CELL_WIDTH,
        top: entity.position[1] * SIZES.CELL_HEIGHT
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
