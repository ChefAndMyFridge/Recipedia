import React, { useState } from "react";

import useModalStore from "@stores/modalStore";

import Input from "@components/common/input/Input.tsx";
import Button from "@components/common/button/Button.tsx";

import StoreConfirmModal from "@pages/storeIngredient/StoreConfirmModal";

const StoreIngredientForm = () => {
  const [customAmountInput, setCustomAmountInput] = useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [storagePlace, setStoragePlace] = useState<string>("냉장실");

  const { openModal, closeModal } = useModalStore();

  function handleSelectedAmount(event: React.ChangeEvent<HTMLSelectElement>): void {
    if (Number(event.target.value) === 0) {
      setCustomAmountInput(true);
    } else {
      setCustomAmountInput(false);
      setSelectedAmount(Number(event.target.value));
    }
  }

  function handleStoragePlace(place: string): void {
    setStoragePlace(place);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    if (!data.name || !data.incomingDate || !data.expirationDate) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const amount = customAmountInput ? selectedAmount : Number(data.amount);

    const ingredient = {
      name: data.name,
      amount,
      incomingDate: data.incomingDate,
      expirationDate: data.expirationDate,
      storagePlace,
    };

    console.log(ingredient);

    // API 호출

    // 모달 이동
    openModal(<StoreConfirmModal />);
  }

  return (
    <form className="px-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 px-6 py-4 bg-[#EEE] rounded-xl">
        <div className="flex justify-between items-end gap-2">
          <Input label="재료명" name="name" type="text" placeHolder="재료명을 입력해주세요" />
          <select
            name="amount"
            onChange={handleSelectedAmount}
            className="w-1/4 h-12 px-2 py-1 rounded-lg border border-subcontent bg-white font-preRegular placeholder:text-gray-400"
          >
            {Array.from({ length: 10 }, (_, amount) => (
              <option key={amount + 1} value={amount + 1}>
                {amount + 1}
              </option>
            ))}
            <option value={0}>직접 입력</option>
          </select>
        </div>

        {customAmountInput && (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between">
              <span className="font-preMedium text-[#333] text-xs font-semibold">수량</span>
              <span className="font-preMedium text-[#333] text-xs">{selectedAmount}</span>
            </div>
            <input
              type="range"
              name="amount"
              min="1"
              max="100"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="w-full h-2 my-4 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        <div className="flex gap-4 justify-between items-center">
          <Input label="입고일" name="incomingDate" type="date" placeHolder="수량을 입력해주세요" />
          <Input label="만료일" name="expirationDate" type="date" placeHolder="수량을 입력해주세요" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-preMedium text-[#333] text-xs font-semibold">위치</p>
          <div className="flex justify-start gap-2 items-center">
            <Button
              type="button"
              design={storagePlace === "냉장실" ? "confirm" : "cancel"}
              content="냉장실"
              className="w-16 h-8"
              onAction={() => handleStoragePlace("냉장실")}
            />
            <Button
              type="button"
              design={storagePlace === "냉동실" ? "confirm" : "cancel"}
              content="냉동실"
              className="w-16 h-8"
              onAction={() => handleStoragePlace("냉동실")}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end align-center px-4 py-4 gap-2">
        <Button type="button" design="cancel" content="취소" className="w-24 h-10" onAction={closeModal} />
        <Button type="submit" design="confirm" content="입고" className="w-24 h-10" />
      </div>
    </form>
  );
};

export default StoreIngredientForm;
