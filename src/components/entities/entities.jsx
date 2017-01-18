
import ndarray from 'ndarray'
import {BLOCK_STATES, SIZES} from 'core/constants/game'

const Entities = ({entities, map, translate}) => {
  let mat = ndarray(map.data, [map.width, map.height])
  // @TODO translate entity position by translate, see previous commit
  let e = entities
    .filter(entity => {
      // To save calling mat.get twice we'll mutate here too, naughty
      let cell = mat.get(...entity.position)
      entity.light = cell.light
      return cell.state === BLOCK_STATES.VISIBLE
    })
    .map((entity, i) => {
      let style = {
        color: entity.color,
        left: (entity.position[0] + translate[0]) * SIZES.CELL_WIDTH,
        top: (entity.position[1] + translate[1]) * SIZES.CELL_HEIGHT,
        opacity: entity.light,
        zIndex: entity.z || 100
      }
      return (
        <span
          key={`entity${i}`}
          className='Entity'
          style={style}
        >
          {entity.char}
        </span>
      )
    })

  return <div>{e}</div>
}

export default Entities
