
import {View} from 'components/view/view'
import Map from 'components/map/map'

const MainView = ({map, entities}) => {
  return (
    <View main>
      <Map map={map} entities={entities} />
    </View>
  )
}

export default MainView
