
/**
 * Handles a very basic performance monitoring and display
 */

import {render} from 'inferno-dom'

import {noop} from 'core/utils'

const stylesheet = {
  'main': {
    position: 'absolute',
    top: '2px',
    right: '2px'
  }
}

const monitorRecord = {
  id: '',
  start: 0,
  time: 0
}

const Component = ({monitors}) => {
  return (
    <ul className='u-nakedList'>
      {monitors.map(m => {
        return (
          <li>
            <span>{`${m.id}: `}</span>
            <span>{`${m.time.toFixed(2)}ms`}</span>
          </li>
        )
      })}
    </ul>
  )
}

const abstract = {
  time: noop,
  timeEnd: noop
}

class Monit {
  monitors = []
  el = null

  constructor () {
    this.el = document.createElement('div')
    Object.assign(this.el.style, {
      ...stylesheet.main
    })
    document.body.appendChild(this.el)
  }

  find = id => {
    return this.monitors.find(monitor => monitor.id === id)
  }

  time = id => {
    let monitor = this.find(id)
    if (monitor) {
      monitor.start = window.performance.now()
      return
    }

    this.monitors.push({
      ...monitorRecord,
      id: id,
      start: window.performance.now(),
      time: 0
    })
  }

  timeEnd = id => {
    let monitor = this.find(id)
    if (monitor) {
      monitor.time = window.performance.now() - monitor.start
      this.render()
      console.log(`${monitor.id} ${monitor.time.toFixed(2)}ms`)
    }
  }

  render = () => {
    render(<Component monitors={this.monitors} />, this.el)
  }
}

const create = () => {
  if (!window.localStorage.getItem('MONIT')) {
    return abstract
  }

  return new Monit()
}

export default create()
