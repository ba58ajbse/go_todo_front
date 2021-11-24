import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { AppThunk, RootState } from '../store'
import { TodoType } from '../../interfaces/types'

const URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/todos'
    : (process.env.REACT_APP_DB_URL as string)

const initialState: TodoType[] = []

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    getAll: (state, action: PayloadAction<TodoType[]>) => {
      if (!Array.isArray(action.payload) || !action.payload.length) {
        return state
      }
      return [...state, ...action.payload].filter((todo, i, self) => {
        return self.findIndex((selfTodo) => selfTodo.id === todo.id) === i
      })
    },
    addTodo: (state, action: PayloadAction<TodoType>) => {
      return [
        ...state,
        {
          id: action.payload.id,
          todo: action.payload.todo,
          completed: action.payload.completed,
        },
      ]
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      return [...state].filter((todo) => todo.id !== action.payload)
    },
    updateTodo: (state, action: PayloadAction<Pick<TodoType, 'id' | 'completed'>>) => {
      return [...state].map((todo) => {
        if (todo.id !== action.payload.id) return todo
        return {
          ...todo,
          completed: action.payload.completed,
        }
      })
    },
  },
})

export const { getAll, addTodo, deleteTodo, updateTodo } = todoSlice.actions

export const getAllAsync = (): AppThunk => async (dispatch) => {
  const items = await axios
    .get(URL)
    .then((res) => res.data)
    .catch((error) => console.log(error))

  dispatch(getAll(items))
}

export const addTodoAsync =
  (data: Pick<TodoType, 'todo'>): AppThunk =>
  async (dispatch) => {
    const todo = await axios
      .post(URL, data)
      .then((res) => res.data)
      .catch((error) => console.log(error))

    dispatch(addTodo(todo))
  }

export const deleteTodoAsync =
  (id: string): AppThunk =>
  async (dispatch) => {
    const status = await axios
      .delete(`${URL}/${id}`)
      .then((res) => res.status)
      .catch((error) => console.log(error))

    if (status === 204) {
      dispatch(deleteTodo(id))
    }
  }

export const updateTodoAsync =
  (id: string, todo: string, completed: boolean): AppThunk =>
  async (dispatch) => {
    const status = await axios
      .put(`${URL}/${id}`, { todo, completed: !completed })
      .then((res) => res.status)
      .catch((error) => console.log(error))

    if (status === 204) {
      dispatch(updateTodo({ id, completed: !completed }))
    }
  }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectTodo = (state: RootState) => state.todo

export default todoSlice.reducer
