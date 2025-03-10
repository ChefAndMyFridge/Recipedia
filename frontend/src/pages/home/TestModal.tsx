import useModalStore from "@/stores/modalStore.ts";

import Input from "@/components/common/input/Input.tsx";

const TestModal = () => {
  const { closeModal } = useModalStore();

  return (
    <div className="flex flex-col justify-between h-[50vh]">
      <h1>Test Modal</h1>
      <Input label="test" type="date" placeHolder="테스트" />
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default TestModal;
