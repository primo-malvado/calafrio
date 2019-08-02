

var _state = {
    relays: [
        {
            x: 2,
            y: 4,
            r:0,
        },
        {
            x: 35,
            y: 4,
            r:1,
        },
        {
            x: 52,
            y: 20,
            r:2,
        },
        {
            x: 2,
            y: 40,
            r:3,
        },
    ]
};



const todos = (state = _state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [
          ...state,
          {
            id: action.id,
            text: action.text,
            completed: false
          }
        ]
      case 'TOGGLE_TODO':
        return state.map(todo =>
          todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
        )
      default:
        return state
    }
  }
  
  export default todos