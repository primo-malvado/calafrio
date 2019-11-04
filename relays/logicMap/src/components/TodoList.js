import React from 'react'
//import PropTypes from 'prop-types'
import Todo from './Todo'
import Relay from './Relay'
import SevenSeg from './SevenSeg'
import SevenSegmentDecoder from './SevenSegmentDecoder'
import ShiftAdd3 from './ShiftAdd3'

const TodoList = ({ todos, toggleTodo }) => (
  <div>



{
Object.keys(todos).filter(function(item){return todos[item].type === "switch"}).map(todoKey =>

      <Todo
        key={todoKey}
        {...todos[todoKey]}
        onClick={() => toggleTodo(todoKey)}
      />
)}

{
Object.keys(todos).filter(function(item){
  return todos[item].type === "relay" && 
    todos[item].parent === ""}).map(todoKey =>

      <Relay
        todoKey={todoKey}
        key={todoKey}
        {...todos[todoKey]}
      />
)}

{
Object.keys(todos).filter(function(item){
  return todos[item].type === "shiftadd3" && 
    todos[item].parent === ""}).map(todoKey =>

      <ShiftAdd3
        todoKey={todoKey}
        key={todoKey}
        {...todos[todoKey]}
      />
)}

 {
Object.keys(todos).filter(function(item){
  return todos[item].type === "7segmentdecoder" && 
    todos[item].parent === ""}).map(todoKey =>

      <SevenSegmentDecoder
        todoKey={todoKey}
        key={todoKey}
        {...todos[todoKey]}
      />
)}

 

{
Object.keys(todos).filter(function(item){return todos[item].type === "7seg"}).map(todoKey =>

      <SevenSeg
        key={todoKey}
        {...todos[todoKey]}
      />
)}

 


  </div>
)

export default TodoList
