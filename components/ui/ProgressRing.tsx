// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography } from '@/constants/theme';

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showLabel?: boolean;
  labelSize?: number;
  children?: React.ReactNode;
}

export const ProgressRing = React.memo(({
  percent,
  size = 80,
  strokeWidth = 8,
  color = Colors.primary,
  bgColor = Colors.border,
  showLabel = true,
  labelSize = Typography.sm,
  children,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {children ? children : showLabel ? (
        <Text style={{ fontSize: labelSize, fontWeight: Typography.bold, color: Colors.textPrimary }}>
          {Math.round(percent)}%
        </Text>
      ) : null}
    </View>
  );
});
