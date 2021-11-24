import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Box, Input, Button } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { addTodoAsync } from '../store/slices/todoSlice'
import { TodoType } from '../interfaces/types'

const TodoInput: React.FC = () => {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()

  const addTodo = async (e: FormEvent<HTMLFormElement>) => {
    if (value === '') return
    e.preventDefault()

    const data: Pick<TodoType, 'todo'> = {
      // id: Math.random().toString(36).slice(-8),
      todo: value,
    }

    dispatch(addTodoAsync(data))
    setValue('')
  }

  return (
    <Box maxW="880" m="0 auto 24px">
      <StyledForm onSubmit={(e) => addTodo(e)}>
        <Input
          type="text"
          width="640px"
          color="white"
          variant="flushed"
          placeholder="Todo"
          size="lg"
          marginRight="12px"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        />
        <Button type="submit">
          <AddIcon />
        </Button>
      </StyledForm>
    </Box>
  )
}

export default TodoInput

const StyledForm = styled.form`
  text-align: center;
`
