import React, {createContext, useContext, useReducer} from 'react';

export type Todo = {
  title: string;
  description: string;
  id?: number;
};

export type TodoContextType = {
  todos: Todo[];
};
type Action =
  | {type: 'add-todo'; todo: Todo}
  | {type: 'load-todo'}
  | {type: 'delete-todo'; todo: Todo};

type Dispatch = (action: Action) => void;

type TodoProviderProps = {children: React.ReactNode};

const initialState: TodoContextType = {todos: []};
const TodoContext = createContext<TodoContextType>(initialState);
const TodoDispatchContext = createContext<Dispatch | undefined>(undefined);

function todoReducer(state: TodoContextType, action: Action) {
  switch (action.type) {
    case 'add-todo': {
      const newTodo: Todo = {...action.todo, id: state.todos.length + 1};
      console.log(newTodo);
      return {
        todos: [...state.todos, {...newTodo}],
      };
    }
    case 'load-todo': {
      return {...state};
    }
    case 'delete-todo': {
      const copytodos = [...state.todos];
      copytodos.splice(copytodos.indexOf(action.todo), 1);
      return {
        ...state,
        todos: copytodos,
      };
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
}

function TodoProvider({children}: TodoProviderProps) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  return (
    <TodoContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}

function useTodoState() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoState must be used within a TodoProvider');
  }
  return context;
}

function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (context === undefined) {
    throw new Error('useTodoDispatch must be used within a TodoProvider');
  }
  return context;
}

export {TodoProvider, useTodoDispatch, useTodoState};
