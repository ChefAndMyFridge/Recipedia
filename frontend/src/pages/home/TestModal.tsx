import useModalStore from "@/stores/modalStore.ts";

const TestModal = () => {
  const { closeModal } = useModalStore();

  return (
    <div className="flex flex-col justify-between h-[50vh]">
      <h1>Test Modal</h1>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default TestModal;
