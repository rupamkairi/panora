import { Circle, Line, Path, Polyline, Rect, Svg } from 'react-native-svg'

import type { ReactNode } from 'react'

import { useIconProps } from '~/interface/icons/useIconProps'

import type { IconProps } from '~/interface/icons/types'

const createIcon = (content: (color: string) => ReactNode) => (props: IconProps) => {
  const { width, height, fill, ...svgProps } = useIconProps(props)
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...svgProps}>
      {content(fill)}
    </Svg>
  )
}

export const PlusIcon = createIcon((color) => (
  <>
    <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2" />
    <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" />
  </>
))
export const PaperclipIcon = createIcon((color) => (
  <Path
    d="M8.5 12.5 15 6a4 4 0 0 1 5.7 5.6l-8.1 8.1a6 6 0 0 1-8.5-8.5l8-8"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
  />
))
export const ToolIcon = createIcon((color) => (
  <Path
    d="M14 7a5 5 0 0 0-6.4-4.8l3 3-3.4 3.4-3-3A5 5 0 0 0 10 12l7.8 7.8 2-2L12 10a5 5 0 0 0 2-3Z"
    stroke={color}
    strokeWidth="1.7"
    strokeLinejoin="round"
  />
))
export const MicrophoneIcon = createIcon((color) => (
  <>
    <Rect x="9" y="3" width="6" height="11" rx="3" stroke={color} strokeWidth="1.8" />
    <Path
      d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4M9 21h6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </>
))
export const SendIcon = createIcon((color) => (
  <>
    <Path
      d="m5 4 15 8-15 8 3-8-3-8Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <Line x1="8" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8" />
  </>
))
export const ChartIcon = createIcon((color) => (
  <>
    <Rect x="4" y="4" width="16" height="16" rx="1" stroke={color} strokeWidth="1.7" />
    <Line x1="8" y1="16" x2="8" y2="12" stroke={color} strokeWidth="2" />
    <Line x1="12" y1="16" x2="12" y2="8" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="16" x2="16" y2="10" stroke={color} strokeWidth="2" />
  </>
))
export const CompareIcon = createIcon((color) => (
  <>
    <Path
      d="M5 7h7l-3-3m3 3-3 3M19 17h-7l3-3m-3 3 3 3"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x="4" y="4" width="3" height="16" stroke={color} strokeWidth="1.5" />
    <Rect x="17" y="4" width="3" height="16" stroke={color} strokeWidth="1.5" />
  </>
))
export const TrendIcon = createIcon((color) => (
  <>
    <Polyline
      points="4,17 10,11 14,15 20,8"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M16 8h4v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </>
))
export const SparkIcon = createIcon((color) => (
  <>
    <Path
      d="M12 2c.6 5.2 2.8 7.4 8 8-5.2.6-7.4 2.8-8 8-.6-5.2-2.8-7.4-8-8 5.2-.6 7.4-2.8 8-8Z"
      fill={color}
    />
    <Path
      d="M19 15c.2 2.1.9 2.8 3 3-2.1.2-2.8.9-3 3-.2-2.1-.9-2.8-3-3 2.1-.2 2.8-.9 3-3Z"
      fill={color}
      opacity=".65"
    />
  </>
))
