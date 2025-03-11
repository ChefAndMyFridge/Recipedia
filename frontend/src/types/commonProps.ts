import React from "react";

export interface ButtonProps {
  type: "button" | "submit" | "reset";
  design: "confirm" | "cancel";
  content: string;
  width?: string;
  height?: string;
  onAction?: () => void;
}

export interface InputProps {
  label?: string;
  name?: string;
  type: string;
  placeHolder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
