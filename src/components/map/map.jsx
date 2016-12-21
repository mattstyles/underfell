
import equal from 'deep-equal'
import ndarray from 'ndarray'

window.equal = equal

import Entities from 'components/entities/entities'
import {ndMap} from 'core/utils/ndarray'
import {BLOCK_STATES, SIZES} from 'core/constants/game'
import {getViewport} from 'core/service/viewport'

const renderCell = cell => {
  if (cell.state === BLOCK_STATES.INVISIBLE) {
    return null
  }

  let renderProps = {
    // opacity: cell.light
    opacity: 1
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

// @TODO this is a rendering bottleneck, need to split up which parts of the
// map get rendered to stop re-drawing unchanging cells. Use pure render
// mixin for componentShouldUpdate.
const render = (mat, translate) => {
  return ndMap(mat, (mat, x, y) => {
    let block = mat.get(x, y)
    return renderCell({
      ...block,
      position: [x + translate[0], y + translate[1]]
    })
  })
}

const Chunk = ({mat, translate}) => {
  return (
    <div>
      {render(mat, translate)}
    </div>
  )
}

var count = 0

/**
 * Calculate the viewport, render just the viewport and pass the offset to
 * the entities renderer so they can render in the correct places.
 */
const Map = ({map, entities}) => {
  let char = entities[0]
  // let v = getViewport(mat, ...char.position)
  let v = [0, 0]
  // return (
  //   <div className='Map'>
  //     {render(mat.hi(v[2], v[3]).lo(v[0], v[1]))}
  //     <Entities
  //       entities={entities}
  //       translate={[-v[0], -v[1]]}
  //     />
  //   </div>
  // )

  // {render(mat.hi(32, 42).lo(0, 0), [0, 0])}
  // {render(mat.hi(64, 42).lo(32, 0), [32, 0])}

  // As we are passing arrays we are actually passing by reference, this means
  // we don't keep multiple versions of basically the same map (light data
  // changes per tick) but means we can not compare props, as they are by ref
  // last always become next. The slicing using hi and lo also does not produce
  // new comparable arrays but uses transposition and changing stride to grab
  // a new view of the array, not a new array.
  //
  // This could get nasty. This might include upping the map object to include
  // a helper for grabbing chunks and to add a dirty flag to each chunk whenever
  // a cell is updated, which would also mean an update/setter function for
  // mutating a cell which also flips the dirty flag to true.
  // Render can then use the chunk-getter to render each chunk if visible and
  // then use the dirty flag to see if a re-render is necessary for that chunk.
  // Even we could compare all cells in a block those deep comparisons probably
  // won't be cheap and I'm not convinced it would be any faster than just
  // updating the dom.
  const shouldUpdate = (node, last, next, a) => {
    // console.log(last, next, equal(last, next))
    // console.log(last.mat.get(0, 0).light, next.mat.get(0, 0).light)
    console.log(last.val, next.val)
    return last !== next
  }

  let mat = ndarray(map.data, [map.width, map.height])

  return (
    <div className='Map'>
      <Chunk
        mat={mat.hi(16, 16).lo(0, 0)}
        translate={[0, 0]}
        val={Math.random()}
        onComponentShouldUpdate={() => map.chunks[0]}
      />
      <Chunk
        mat={mat.hi(32, 16).lo(16, 0)}
        translate={[16, 0]}
        val={Math.random()}
        onComponentShouldUpdate={() => map.chunks[1]}
      />
      <Entities
        entities={entities}
        translate={[-v[0], -v[1]]}
      />
    </div>
  )

  // return (
  //   <div className='Map'>
  //     <Chunk
  //       mat={mat.hi(32, 42).lo(0, 0)}
  //       translate={[0, 0]}
  //       val={Math.random()}
  //       onComponentShouldUpdate={() => true}
  //     />
  //     <Chunk
  //       mat={mat.hi(64, 42).lo(32, 0)}
  //       translate={[32, 0]}
  //       val={Math.random()}
  //       onComponentShouldUpdate={() => {
  //         console.log(count)
  //         if (count < 1) {
  //           count = 2
  //           return true
  //         }
  //         console.log('false')
  //         return false
  //       }}
  //     />
  //     <Entities
  //       entities={entities}
  //       translate={[-v[0], -v[1]]}
  //     />
  //   </div>
  // )
}

export default Map
