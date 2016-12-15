
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

const checkBounds = (mat, x, y) => {
  if (x < 0 || y < 0) {
    return false
  }

  if (x >= mat.shape[0] || y >= mat.shape[1]) {
    return false
  }

  return true
}

const updateCell = (mat, x, y) => {
  if (!checkBounds(mat, x, y)) {
    return
  }

  makeCellVisible(mat.get(x, y))
}

export const updateVisibility = (mat, char) => {
  clearVisibility(mat)

  const x = char.position[0]
  const y = char.position[1]

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      updateCell(mat, x + i, y + j)
    }
  }

  return mat
}
