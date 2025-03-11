import React, { useState } from "react";

import useModalStore from "@stores/modalStore";

import Input from "@components/common/input/Input.tsx";
import Button from "@components/common/button/Button.tsx";

import StoreConfirmModal from "@pages/storeIngredient/StoreConfirmModal";

const StoreIngredientForm = () => {
  const [storagePlace, setStoragePlace] = useState("냉장실");

  const { openModal, closeModal } = useModalStore();

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

    const ingredient = {
      name: data.name,
      incomingDate: data.incomingDate,
      expirationDate: data.expirationDate,
      storagePlace: storagePlace,
    };

    console.log(ingredient);

    // API 호출

    // 모달 이동
    openModal(<StoreConfirmModal />);
  }

  return (
    <form className="px-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 px-6 py-4 bg-[#EEE] rounded-xl">
        <div>
          <Input label="재료명" name="name" type="text" placeHolder="재료명을 입력해주세요" />
        </div>
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
