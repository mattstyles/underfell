
import classnames from 'classnames'

export const View = ({children, classes, scroll, main}) => {
  return (
    <div className={classnames({
      'View': true,
      'Main': main,
      'ScrollView': scroll
    }, classes)}>
      {children}
    </div>
  )
}
