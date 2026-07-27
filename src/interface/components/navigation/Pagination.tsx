import { SizableText, XStack } from 'tamagui'
import { Button } from '../actions/Button'

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  return (
    <XStack items="center" gap="$2" py="$4">
      <Button
        variant="secondary"
        uiSize="md"
        disabled={page <= 1}
        onPress={() => onPageChange(page - 1)}
      >
        ‹
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'primary' : 'secondary'}
          uiSize="md"
          onPress={() => onPageChange(p)}
        >
          {String(p)}
        </Button>
      ))}
      <Button
        variant="secondary"
        uiSize="md"
        disabled={page >= totalPages}
        onPress={() => onPageChange(page + 1)}
      >
        ›
      </Button>
    </XStack>
  )
}
