import { SizableText, XStack } from 'tamagui'
import { colors } from '../colors'

export const Breadcrumbs = ({ items }: { items: { label: string; href?: string }[] }) => (
  <XStack items="center" gap="$2" py="$2">
    {items.map((item, i) => (
      <XStack key={item.label} items="center" gap="$2">
        {i > 0 && (
          <SizableText fontSize={14} color={colors.outline} px="$1">
            /
          </SizableText>
        )}
        <SizableText
          fontFamily="$body"
          fontSize={14}
          fontWeight={i === items.length - 1 ? '600' : '400'}
          color={i === items.length - 1 ? colors.content : colors.contentSecondary}
        >
          {item.label}
        </SizableText>
      </XStack>
    ))}
  </XStack>
)
