import React, { useEffect } from 'react'
import { Box, List } from '@chakra-ui/layout'
import TodoItem from './TodoItem'
import { useDispatch, useSelector } from 'react-redux'
import { selectTodo, getAllAsync } from '../store/slices/todoSlice'

const TodoList: React.FC = () => {
  const dispatch = useDispatch()
  const todoList = useSelector(selectTodo)

  useEffect(() => {
    dispatch(getAllAsync())
  }, [])

  return (
    <Box maxW="720" m="0 auto">
      <List p="0 20px 0 20px" color="white">
        {todoList &&
          todoList.length > 0 &&
          todoList.map((todo) => <TodoItem key={todo.id} todoItem={todo} />)}
      </List>
    </Box>
  )
}

export default TodoList
