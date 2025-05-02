"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Container, Title, Text, Button, Group, Paper, ThemeIcon } from "@mantine/core"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Link } from "react-router-dom"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo })
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Container size="md" py={80}>
          <Paper p="xl" radius="md" withBorder>
            <Group position="center" mb="lg">
              <ThemeIcon size={80} radius={40} color="orange">
                <AlertTriangle size={40} />
              </ThemeIcon>
            </Group>
            <Title align="center" order={2} mb="md">
              Something went wrong
            </Title>
            <Text align="center" color="dimmed" mb="xl">
              We're sorry, but there was an error loading this page. Our team has been notified.
            </Text>
            <Group position="center" spacing="md">
              <Button leftIcon={<RefreshCw size={16} />} onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button component={Link} to="/" variant="outline" leftIcon={<Home size={16} />}>
                Go to Homepage
              </Button>
            </Group>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Paper withBorder p="md" mt="xl" bg="gray.0">
                <Text size="sm" color="red" weight={500} mb="xs">
                  Error: {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text size="xs" component="pre" style={{ whiteSpace: "pre-wrap" }}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </Paper>
            )}
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
