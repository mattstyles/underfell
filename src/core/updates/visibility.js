
import {ndIterate} from 'core/utils/ndarray'
import {BLOCK_STATES} from 'core/constants/game'

export const clearVisibility = mat => {
  return ndIterate(mat, (mat, x, y) => {
    let cell = mat.get(x, y)
    cell.state = cell.state === BLOCK_STATES.INVISIBLE
      ? BLOCK_STATES.INVISIBLE
      : BLOCK_STATES.DISCOVERED
  })
}

const makeCellVisible = cell => {
  cell.state = BLOCK_STATES.VISIBLE
}

export const updateVisibility = (mat, char) => {
  clearVisibility(mat)

  const x = char.position[0]
  const y = char.position[1]

  makeCellVisible(mat.get(x, y))
  makeCellVisible(mat.get(x + 1, y))
  makeCellVisible(mat.get(x - 1, y))
  makeCellVisible(mat.get(x, y + 1))
  makeCellVisible(mat.get(x, y - 1))

  return mat
}
