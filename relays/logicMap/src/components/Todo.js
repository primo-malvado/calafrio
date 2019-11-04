import React from 'react'
import PropTypes from 'prop-types'

const Todo = ({ onClick, output }) => (
  <div
    onClick={onClick}
    className={output ? 'switch on' : 'switch off'}
  >

  </div>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  //completed: PropTypes.bool.isRequired,
  output: PropTypes.number.isRequired
}

export default Todo
