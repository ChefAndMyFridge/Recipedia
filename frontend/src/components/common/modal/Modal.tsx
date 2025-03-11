import "@/components/common/modal/Modal.css";

import { useRef, useEffect } from "react";

import useModalStore from "@stores/modalStore.ts";

const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModalStore();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
    } else if (modal.open) {
      modal.close();
    }
  }, [isOpen, modalContent]);

  // ESC 클릭시에도 모달이 닫히도록
  const handleClose = () => {
    closeModal();
  };

  return (
    <dialog
      ref={dialog}
      onClose={handleClose}
      className="fixed top-0 z-50 mx-auto w-full rounded-b-xl"
      style={{ maxWidth: "clamp(344px, 100vw, 576px)" }}
    >
      {modalContent}
    </dialog>
  );
};

export default Modal;
