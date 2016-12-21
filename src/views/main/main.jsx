
import {View} from 'components/view/view'
import Map from 'components/map/map'

const MainView = ({map, entities}) => {
  return (
    <View main>
      <div>{`x: ${entities[0].position[0]}`}</div>
      <div>{`y: ${entities[0].position[1]}`}</div>
      <Map map={map} entities={entities} />
    </View>
  )
}

export default MainView
