"use client"

import type { FC } from "react"
import { Button, Group } from "@mantine/core"
import { RefreshCw } from "lucide-react"

interface RetryButtonProps {
  onRetry: () => void
  isLoading?: boolean
}

const RetryButton: FC<RetryButtonProps> = ({ onRetry, isLoading = false }) => {
  return (
    <Group position="center" mt="md">
      <Button leftIcon={<RefreshCw size={16} />} onClick={onRetry} loading={isLoading} variant="outline">
        Retry
      </Button>
    </Group>
  )
}

export default RetryButton
