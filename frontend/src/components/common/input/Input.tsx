import React from "react";

// 부모 요소에서 접근 방법: onChange={(event) => setEffect(event.target.value)}

interface InputProps {
  label?: string;
  type: string;
  placeHolder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ label, type, placeHolder, value, onChange }: InputProps) => {
  return (
    <div className="flex flex-col w-full items-start justify-between gap-2">
      {label && <label className="font-preMedium text-[#333] text-xs font-semibold">{label}</label>}
      <input
        type={type}
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
        className="flex items-center self-stretch px-2 py-1 g-2 rounded-lg border border-subcontent bg-white font-preRegular placeholder:text-gray-400"
      />
    </div>
  );
};

export default Input;
