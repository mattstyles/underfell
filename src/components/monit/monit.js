
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
    }
  }

  render = () => {
    console.log(this)
    render(<Component monitors={this.monitors} />, this.el)
  }
}

const create = () => {
  if (!window.localStorage.getItem('MONIT')) {
    console.log('abstract')
    return abstract
  }

  // var el = document.createElement('div')
  // Object.assign(el.style, {
  //   ...stylesheet.main
  // })
  // document.body.appendChild(el)
  //
  // signal.observe(state => {
  //   console.log('render monit')
  //   render(<Monit state={state} />, el)
  // }, error => {
  //   console.error(error)
  // })
  let monit = new Monit()

  return monit
}

export default create()
