import { useMemo } from 'react'
import { YStack } from 'tamagui'

import type { ChatQuota } from '~/features/chat/types'

import { Button } from '../actions'
import { Popover } from '../overlays'
import { Text } from '../typography'

export function QuotaIndicator({ quota }: { quota: ChatQuota }) {
  const resetLabel = useMemo(
    () =>
      quota.resetAt
        ? new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(quota.resetAt))
        : null,
    [quota.resetAt],
  )

  if (quota.unlimited) {
    return (
      <Text size="xs" weight="semibold">
        Dev · Unlimited
      </Text>
    )
  }

  return (
    <Popover
      placement="bottom-end"
      content={
        <YStack gap="$2">
          <Text weight="semibold">Daily ask limit</Text>
          <Text size="sm" tone="secondary">
            You can ask Panora 10 AI questions in each 24-hour window.
          </Text>
          <Text size="sm">
            {resetLabel
              ? `Your limit resets on ${resetLabel}.`
              : 'Your 24-hour window starts with your first ask.'}
          </Text>
        </YStack>
      }
    >
      <Button
        variant="ghost"
        uiSize="sm"
        px="$2"
        aria-label={`${quota.remaining} asks left. Show limit details`}
      >
        <Text size="xs" weight="semibold">
          {quota.remaining} left
        </Text>
      </Button>
    </Popover>
  )
}
