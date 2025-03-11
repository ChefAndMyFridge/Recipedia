import React from "react";

export interface ButtonProps {
  type: "button" | "submit" | "reset";
  design: "confirm" | "cancel";
  content: string;
  onAction?: () => void;
  className?: string;
}

export interface InputProps {
  label?: string;
  name?: string;
  type: string;
  placeHolder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ToggleProps {
  isToggle: boolean;
  onToggle: (isToggle: boolean) => void;
}
