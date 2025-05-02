"use client"

import { type FC, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Anchor,
  Group,
  Divider,
  Stack,
  Alert,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useAuthStore } from "../../store/auth.store"
import { AlertCircle } from "lucide-react"

interface LocationState {
  from?: {
    pathname: string
  }
}

const Login: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as LocationState)?.from?.pathname || "/"

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (value.length < 2 ? "Username must have at least 2 characters" : null),
      password: (value) => (value.length < 6 ? "Password must have at least 6 characters" : null),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true)
      setError(null)
      const success = await login(values.username, values.password)

      if (success) {
        navigate(from, { replace: true })
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: theme.fontFamily, fontWeight: 900 })}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Don't have an account yet?{" "}
        <Anchor component={Link} to="/register" size="sm">
          Create account
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
            <TextInput label="Username" placeholder="Your username" required {...form.getInputProps("username")} />

            <PasswordInput label="Password" placeholder="Your password" required {...form.getInputProps("password")} />
          </Stack>

          <Group position="apart" mt="lg">
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <Button variant="outline">Demo User</Button>
        </Group>

        <Text color="dimmed" size="sm" align="center" mt={5}>
          Use username: <b>admin</b> and password: <b>password</b> for demo
        </Text>
      </Paper>
    </Container>
  )
}

export default Login
