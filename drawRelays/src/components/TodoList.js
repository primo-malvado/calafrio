import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'
import Edge from './Edge'

const TodoList = ({ todos,   toggleTodo }) => (


<svg
	width="640"
	height="480">

        {todos.relays.map( (todo) => (
          <Todo key={todo.id}  {...todo} onClick={() => toggleTodo(todo.id)} />
        ))}

        {todos.edges.map( (edge, idg) => (
          <Edge key={idg} {...edge} relays={todos.relays}  />
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