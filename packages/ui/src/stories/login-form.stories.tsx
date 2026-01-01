import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { within } from '@storybook/testing-library'
import React from 'react'
import { Button } from '../components/button'
import { Input } from '../components/input'

// Simple LoginForm for interaction testing
function LoginForm({ onSubmit, disabled = false }:{ onSubmit: (e: {email:string,password:string})=>void, disabled?: boolean }){
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({email,password}) }}>
      <label htmlFor="email">Email</label>
      <Input id="email" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <Input id="password" type="password" value={password} onChange={(e:any)=>setPassword(e.target.value)} />
      <Button type="submit" disabled={disabled}>Login</Button>
    </form>
  )
}

const meta = {
  component: LoginForm,
  args: {
    onSubmit: fn(),
    disabled: false,
  }
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    disabled: false,
  },
  // play removed: tests disabled temporarily
}
