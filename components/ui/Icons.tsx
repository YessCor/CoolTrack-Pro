import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, G, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const HomeIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Path d="M9 21V12h6v9" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </Svg>
);

export const ClipboardIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth={strokeWidth}/>
    <Path d="M9 3v2h6V3" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Line x1="9" y1="10" x2="15" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="9" y1="14" x2="13" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const UsersIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={strokeWidth}/>
    <Path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Path d="M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Path d="M21 21v-2a4 4 0 00-3-3.85" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const WrenchIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const UserIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth}/>
    <Path d="M4 21v-1a8 8 0 0116 0v1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const BarChartIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth={strokeWidth}/>
    <Rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth={strokeWidth}/>
    <Rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth={strokeWidth}/>
  </Svg>
);

export const MapPinIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={strokeWidth}/>
  </Svg>
);

export const CalendarIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={strokeWidth}/>
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={strokeWidth}/>
  </Svg>
);

export const BellIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const LogOutIcon = ({ size = 24, color = '#EF4444', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Polyline points="16 17 21 12 16 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const PlusIcon = ({ size = 24, color = '#FFFFFF', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const ChevronRightIcon = ({ size = 24, color = '#64748B', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="9 18 15 12 9 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const ArrowLeftIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Polyline points="12 19 5 12 12 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const MailIcon = ({ size = 24, color = '#64748B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth={strokeWidth}/>
    <Polyline points="22,4 12,13 2,4" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </Svg>
);

export const PhoneIcon = ({ size = 24, color = '#64748B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.3a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .55h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15.92z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
  </Svg>
);

export const ShieldIcon = ({ size = 24, color = '#10B981', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Polyline points="9 12 11 14 15 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const AirVentIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="3" width="20" height="5" rx="1.5" stroke={color} strokeWidth={strokeWidth}/>
    <Path d="M4 8v13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Path d="M20 8v5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Path d="M20 17a2 2 0 10-4 0c0 1.1.9 2 2 2 1.66 0 4 .5 4 2H14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M4 12h6a4 4 0 010 8H4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const CameraIcon = ({ size = 24, color = '#64748B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={strokeWidth}/>
  </Svg>
);

export const FileTextIcon = ({ size = 24, color = '#64748B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Polyline points="10 9 9 9 8 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const AlertTriangleIcon = ({ size = 24, color = '#F59E0B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="10.29 3.86 1.82 18 22.18 18 13.71 3.86 10.29 3.86" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const CheckCircleIcon = ({ size = 24, color = '#10B981', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth}/>
    <Polyline points="9 12 11 14 15 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const SearchIcon = ({ size = 24, color = '#64748B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={strokeWidth}/>
    <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const EyeOffIcon = ({ size = 24, color = '#64748B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const EyeIcon = ({ size = 24, color = '#64748B', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth}/>
  </Svg>
);

export const GoogleIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </Svg>
);

export const XIcon = ({ size = 24, color = '#64748B', strokeWidth = 2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const ToolIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Path d="M13 13l6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
  </Svg>
);

export const LayersIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="12 2 2 7 12 12 22 7 12 2" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <Polyline points="2 17 12 22 22 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <Polyline points="2 12 12 17 22 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const WrenchIcon = ({ size = 24, color = '#0F4C75', strokeWidth = 1.8 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);
