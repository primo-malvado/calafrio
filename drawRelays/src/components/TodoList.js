import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

const TodoList = ({ todos, toggleTodo }) => (


<svg
	width="640"
	height="480">

        {todos.relays.map( (todo, idz) => (
          <Todo key={idz} {...todo} onClick={() => toggleTodo(todo.id)} />
        ))}


        <path className="edge" d="M 10,70 C 20,20 200,20 210,70"></path>

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