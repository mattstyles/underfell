
import {View} from 'components/view/view'
import Map from 'components/map/map'
import {generate} from 'core/service/map'

const WIDTH = 64
const HEIGHT = 32
let map = generate(WIDTH, HEIGHT)

const MainView = ({state}) => {
  return (
    <View main>
      <h1>Hello World</h1>
      <div>{`x: ${state.position[0]}`}</div>
      <div>{`y: ${state.position[1]}`}</div>
      <Map mat={map} />
    </View>
  )
}

export default MainView
