import React from "react";

export interface ButtonProps {
  type: "confirm" | "cancel";
  content: string;
  width?: string;
  height?: string;
  onAction?: () => void;
}

export interface InputProps {
  label?: string;
  type: string;
  placeHolder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
