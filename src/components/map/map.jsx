
import Entities from 'components/entities/entities'
import {ndMap} from 'core/utils/ndarray'
import {BLOCK_STATES, BLOCK_SIZE} from 'core/constants/game'

const renderBlock = block => {
  if (block.state === BLOCK_STATES.INVISIBLE) {
    return null
  }

  let renderProps = {
    opacity: 1
  }

  if (block.state === BLOCK_STATES.DISCOVERED) {
    renderProps.opacity = 0.25
  }

  return (
    <span
      className='Block'
      style={{
        color: block.color,
        left: block.x * BLOCK_SIZE.WIDTH,
        top: block.y * BLOCK_SIZE.HEIGHT,
        ...renderProps
      }}
    >{block.char}</span>
  )
}

const render = mat => {
  return ndMap(mat, (mat, x, y) => {
    let block = mat.get(x, y)
    return renderBlock({
      ...block,
      x,
      y
    })
  })
}

const Map = ({mat, entities}) => {
  return (
    <div className='Map'>
      {render(mat)}
      <Entities entities={entities} />
    </div>
  )
}

export default Map
