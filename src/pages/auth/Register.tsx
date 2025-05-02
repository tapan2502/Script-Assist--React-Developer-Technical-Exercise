"use client"

import { type FC, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { TextInput, PasswordInput, Paper, Title, Container, Button, Text, Anchor, Stack, Alert } from "@mantine/core"
import { useForm } from "@mantine/form"
import { AlertCircle } from "lucide-react"

const Register: FC = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) => (value.length < 2 ? "Username must have at least 2 characters" : null),
      password: (value) => (value.length < 6 ? "Password must have at least 6 characters" : null),
      confirmPassword: (value, values) => (value !== values.password ? "Passwords did not match" : null),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would register the user here
      // For this demo, just redirect to login with a success message
      navigate("/login", { state: { registered: true } })
    } catch (err) {
      setError("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: theme.fontFamily, fontWeight: 900 })}>
        Create an account
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor component={Link} to="/login" size="sm">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="Email" placeholder="you@example.com" required {...form.getInputProps("email")} />

            <TextInput label="Username" placeholder="Your username" required {...form.getInputProps("username")} />

            <PasswordInput label="Password" placeholder="Your password" required {...form.getInputProps("password")} />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps("confirmPassword")}
            />
          </Stack>

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Register
          </Button>
        </form>

        <Text color="dimmed" size="sm" align="center" mt={15}>
          By registering, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Paper>
    </Container>
  )
}

export default Register
