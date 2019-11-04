import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'
import Edge from './Edge'

const TodoList = ({ todos,   toggleTodo }) => (


<svg
	width="1000"
	height="800">
    <rect width="100%" height="100%" fill="aliceblue"/>

        {todos.relays.map( (todo, relayIdx) => (
          <Todo key={relayIdx}  {...todo} onClick={() => toggleTodo(todo.id)} />
        ))}

        {todos.edges.map( (edge, edgeIdx) => (
          <Edge key={edgeIdx} {...edge} />
        ))}        

    </svg>


  
)

// TodoList.propTypes = {
//   todos: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       completed: PropTypes.bool.isRequired,
//       text: PropTypes.string.isRequired
//     }).isRequired
//   ).isRequired,
//   toggleTodo: PropTypes.func.isRequired
// }

export default TodoList