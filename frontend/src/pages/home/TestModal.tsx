import useModalStore from "@/stores/modalStore.ts";

import Input from "@/components/common/input/Input.tsx";
import Button from "@/components/common/button/Button.tsx";

const TestModal = () => {
  const { closeModal } = useModalStore();

  return (
    <div className="flex flex-col justify-between h-[50vh]">
      <h1>Test Modal</h1>
      <Input label="test" type="date" placeHolder="테스트" />
      <div className="flex justify-between align-center px-2 gap-2">
        <Button type="cancel" onAction={closeModal} content="닫기"></Button>
        <Button type="confirm" onAction={closeModal} content="Close" />
      </div>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default TestModal;
