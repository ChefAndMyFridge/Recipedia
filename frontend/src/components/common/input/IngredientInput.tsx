import React, { useState, useEffect } from "react";

import { useGetIngredientsInfoList } from "@hooks/useIngredientsHooks";

import { InputProps } from "@/types/commonProps.ts";
import { IngredientsInfo } from "@/types/ingredientsTypes.ts";

import noImg from "@assets/images/noIngredient/carrot.png";

const Suggestion = ({
  suggestion,
  onSelectSuggestion,
}: {
  suggestion: IngredientsInfo;
  onSelectSuggestion: (suggestion: string) => void;
}) => {
  return (
    <li
      key={suggestion.ingredientInfoId}
      className="flex justify-start items-center h-12 px-3 py-2 gap-3 cursor-pointer hover:bg-gray-100"
      onMouseDown={() => onSelectSuggestion(suggestion.name)}
    >
      <span className="h-full aspect-[1/1] rounded-xl">
        <img
          src={suggestion.imageUrl ? suggestion.imageUrl : noImg}
          alt="no image"
          className="w-full h-full object-cover rounded-3xl"
        />
      </span>
      <span className="font-preRegular">{suggestion.name}</span>
    </li>
  );
};

const IngredientInput = ({ label, name, type, placeHolder, labelTextSize }: InputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [ingredientsInfo, setIngredientsInfo] = useState<IngredientsInfo[] | []>([]);

  // API 호출을 초기에는 비활성화한 상태에서 쿼리 객체를 가져옴
  const { data, refetch } = useGetIngredientsInfoList({ enabled: false });

  useEffect(() => {
    refetch(); // 컴포넌트가 마운트될 때 강제로 API를 호출
  }, []);

  // 자동완성 데이터 저장
  useEffect(() => {
    if (data) {
      setIngredientsInfo(data);
    }
  }, [data]);

  // ver1. 입력한 단어가 포함된 재료명 필터링
  const filteredSuggestions = ingredientsInfo?.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // ver2. 입력한 단어로 시작하는 재료명 필터링
  // const filteredSuggestions = ingredientsInfo
  // ?.filter((ingredient) => ingredient.name.toLowerCase().startsWith(inputValue.toLowerCase()));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="relative flex flex-col w-full items-start justify-between gap-2">
      {label && <label className={`font-preMedium text-[#333] ${labelTextSize} font-semibold text-xs`}>{label}</label>}
      <input
        name={name}
        type={type}
        placeholder={placeHolder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-3 py-1 h-12 rounded-lg border border-subcontent bg-white font-preRegular placeholder:text-gray-400"
        autoComplete="off"
      />

      {/* 자동 완성 */}
      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 w-full max-h-60 z-10 bg-white border border-gray-300 rounded-lg shadow-md overflow-y-auto">
          {filteredSuggestions &&
            filteredSuggestions.map((suggestion) => (
              <Suggestion
                key={suggestion.ingredientInfoId}
                suggestion={suggestion}
                onSelectSuggestion={handleSelectSuggestion}
              />
            ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientInput;
