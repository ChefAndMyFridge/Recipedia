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
  labelTextSize?: string;
}

export interface ToggleProps {
  isToggle: boolean;
  onToggle: (isToggle: boolean) => void;
}

export interface KeypadProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export interface KeypadElemProps {
  value: string;
  onChange: (val: string) => void;
}
