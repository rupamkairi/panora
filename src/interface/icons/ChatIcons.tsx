import Svg, { Circle, Line, Path, Rect } from 'react-native-svg'

type IconProps = { size?: number; color?: string }
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24' })

export const MenuIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <Line x1="4" y1="7" x2="20" y2="7" />
    <Line x1="4" y1="12" x2="16" y2="12" />
    <Line x1="4" y1="17" x2="19" y2="17" />
  </Svg>
)

export const MoreIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill={color}>
    <Circle cx="5" cy="12" r="1.5" />
    <Circle cx="12" cy="12" r="1.5" />
    <Circle cx="19" cy="12" r="1.5" />
  </Svg>
)

export const PlusIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
)

export const SendIcon = ({ size = 21, color = 'currentColor' }: IconProps) => (
  <Svg
    {...base(size)}
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinejoin="round"
  >
    <Path d="M4 12 20 4l-5 16-3-7-8-1Z" />
    <Path d="m12 13 8-9" />
  </Svg>
)

export const MicIcon = ({ size = 21, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <Rect x="8" y="3" width="8" height="12" rx="4" />
    <Path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
  </Svg>
)

export const StopIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill={color}>
    <Rect x="6" y="6" width="12" height="12" rx="2" />
  </Svg>
)

export const CloseIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="m6 6 12 12M18 6 6 18" />
  </Svg>
)

export const SearchIcon = ({ size = 19, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <Circle cx="11" cy="11" r="6.5" />
    <Path d="m16 16 4 4" />
  </Svg>
)

export const FileIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <Svg
    {...base(size)}
    fill="none"
    stroke={color}
    strokeWidth={1.7}
    strokeLinejoin="round"
  >
    <Path d="M7 3h7l4 4v14H7zM14 3v5h4" />
  </Svg>
)

export const CheckIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <Path d="m5 12 4 4L19 6" />
  </Svg>
)

export const BackIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <Svg {...base(size)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
    <Path d="m15 5-7 7 7 7" />
  </Svg>
)

export const ShareIcon = ({ size = 19, color = 'currentColor' }: IconProps) => (
  <Svg
    {...base(size)}
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="18" cy="5" r="2.5" />
    <Circle cx="6" cy="12" r="2.5" />
    <Circle cx="18" cy="19" r="2.5" />
    <Path d="m8.3 10.9 7.4-4.7M8.3 13.1l7.4 4.7" />
  </Svg>
)

export const TrashIcon = ({ size = 19, color = 'currentColor' }: IconProps) => (
  <Svg
    {...base(size)}
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14M10 11v6M14 11v6" />
  </Svg>
)
