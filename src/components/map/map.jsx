
import ndarray from 'ndarray'

import Entities from 'components/entities/entities'
import {ndMap} from 'core/utils/ndarray'
import {BLOCK_STATES, SIZES, CHUNK_STATES} from 'core/constants/game'
import {getViewport} from 'core/service/viewport'
import {Rect} from 'core/utils'

/**
 * Render an individual cell
 */
const renderCell = cell => {
  if (cell.state === BLOCK_STATES.INVISIBLE) {
    return null
  }

  let renderProps = {
    opacity: cell.light
  }

  if (cell.state === BLOCK_STATES.DISCOVERED) {
    renderProps.opacity = 0.25
  }

  return (
    <span
      className='Block'
      style={{
        color: cell.color,
        left: cell.position[0] * SIZES.CELL_WIDTH,
        top: cell.position[1] * SIZES.CELL_HEIGHT,
        ...renderProps
      }}
    >{cell.char}</span>
  )
}

/**
 * Maps over the matrix rendering cells
 * Translate is relative to the chunk div
 */
const render = (mat, translate) => {
  return ndMap(mat, (mat, x, y) => {
    let block = mat.get(x, y)
    return renderCell({
      ...block,
      position: [x + translate[0], y + translate[1]]
    })
  })
}

/**
 * Render a chunk, which is absolutely positioned so pass a [0, 0] translate
 * to cells within the chunk, this is not removed from code awaiting testing.
 */
const Chunk = ({mat, translate}) => {
  // console.log(translate)
  return (
    <div className='Chunk' style={{
      width: SIZES.CHUNK_WIDTH * SIZES.CELL_WIDTH,
      height: SIZES.CHUNK_HEIGHT * SIZES.CELL_HEIGHT,
      left: translate[0] * SIZES.CELL_WIDTH,
      top: translate[1] * SIZES.CELL_HEIGHT
    }}>
      {render(mat, [0, 0])}
    </div>
  )
}

/**
 * Chunk update function, checks the chunk dirty flag to see if it should
 * recalculate the DOM. As we are potentially rendering a large number of nodes
 * per map this chunking helps to reduce draw calls to only chunks that have
 * actually changed.
 * @TODO removing dirty checking for now as we've now got viewport culling this
 * limits the overdraw. Still slow for very large viewports though, could be
 * fixed by reintroducing dirty checking and performing the translations inside
 * another element.
 */
const shouldChunkUpdate = (node, last, next, a) => {
  // return next.isDirty !== CHUNK_STATES.CLEAN
  return true
}

/**
 * Calculate the viewport, render just the viewport and pass the offset to
 * the entities renderer so they can render in the correct places.
 */
const Map = ({map, entities}) => {
  let mat = ndarray(map.data, [map.width, map.height])

  let char = entities[0]
  let v = getViewport(mat, ...char.position)

  // console.log(v.inspect())

  // Use the viewport to filter non-visible chunks and map into Chunk
  // components.
  // @TODO remove overdraw. Currently if any cell of a chunk is visible then we
  // render it, when we should render just that one cell.
  let chunks = map.chunks
    .filter(chunk => {
      let chunkRect = new Rect([...chunk.translate], [
        chunk.translate[0] + SIZES.CHUNK_WIDTH,
        chunk.translate[1] + SIZES.CHUNK_HEIGHT
      ])
      return v.overlaps(chunkRect)
    })
    .map((chunk, i) => {
      // Translate against the current viewport
      let translate = [
        chunk.translate[0] - v.p1[0],
        chunk.translate[1] - v.p1[1]
      ]

      // For now render every cell in the block, overflow:hidden will
      // obscure it
      let rect = [
        chunk.translate[0],
        chunk.translate[1],
        chunk.translate[0] + SIZES.CHUNK_WIDTH,
        chunk.translate[1] + SIZES.CHUNK_HEIGHT
      ]

      // console.log(i, `[${chunk.translate[0]}, ${chunk.translate[1]}]`,
      //   `[${translate[0]}, ${translate[1]}]`)

      return (
        <Chunk
          mat={mat.hi(
            rect[2],
            rect[3]
          ).lo(
            rect[0],
            rect[1]
          )}
          translate={translate}
          isDirty={chunk.state}
          onComponentShouldUpdate={shouldChunkUpdate}
        />
      )
    })

  return (
    <div className='Map' style={{
      width: SIZES.VIEWPORT_WIDTH * SIZES.CELL_WIDTH,
      height: SIZES.VIEWPORT_HEIGHT * SIZES.CELL_HEIGHT
    }}>
      {chunks}
      <Entities
        entities={entities}
        translate={[-v.p1[0], -v.p1[1]]}
      />
    </div>
  )
}

export default Map
