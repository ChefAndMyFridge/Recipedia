import KeypadElem from "@components/common/keypad/components/KeypadElem";

import { KeypadProps } from "@/types/commonProps";

const KeyPad = ({ label, value, onChange, onClose }: KeypadProps) => {
  return (
    <div className="absolute top-full right-0 z-10 w-fit p-3.5 bg-white rounded-xl shadow-lg font-preMedium">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs">{label}</span>
        <button type="button" className="font-preBold text-xs rounded-lg text-primaryDark" onClick={onClose}>
          완료
        </button>
      </div>

      <KeypadElem value={value} onChange={onChange} />
    </div>
  );
};

export default KeyPad;
