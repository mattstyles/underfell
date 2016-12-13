
import {View} from 'components/view/view'
import {generate} from 'core/service/map'

const WIDTH = 64
const HEIGHT = 32
let map = generate(WIDTH, HEIGHT)

const renderRow = (mat, row) => {
  let cells = []
  for (let x = 0; x < WIDTH; x++) {
    let cell = map.get(x, row)
    cells.push(<span>{cell ? '#' : ' '}</span>)
  }
  return cells
}

const renderGrid = mat => {
  let rows = []
  for (let y = 0; y < HEIGHT; y++) {
    rows.push(<div>{renderRow(mat, y)}</div>)
  }
  return rows
}

const MainView = ({state}) => {
  return (
    <View main>
      <h1>Hello World</h1>
      <div>{`x: ${state.position[0]}`}</div>
      <div>{`y: ${state.position[1]}`}</div>
      <div className='Map'>{renderGrid(map)}</div>
    </View>
  )
}

export default MainView
