
import {View} from 'components/view/view'

const MainView = ({state}) => {
  return (
    <View main>
      <h1>Hello World</h1>
      <div>{`x: ${state.position[0]}`}</div>
      <div>{`y: ${state.position[1]}`}</div>
    </View>
  )
}

export default MainView
