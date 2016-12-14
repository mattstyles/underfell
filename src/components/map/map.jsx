
import Entities from 'components/entities/entities'

const renderRow = (mat, y) => {
  let cells = []
  for (let x = 0; x < mat.shape[0]; x++) {
    let cell = mat.get(x, y)
    cells.push(<span>{cell ? '#' : ' '}</span>)
  }
  return cells
}

const renderGrid = mat => {
  let rows = []
  for (let y = 0; y < mat.shape[1]; y++) {
    rows.push(<div>{renderRow(mat, y)}</div>)
  }
  return rows
}

const Map = ({mat, entities}) => {
  return (
    <div className='Map'>
      {renderGrid(mat)}
      <Entities entities={entities} />
    </div>
  )
}

export default Map
