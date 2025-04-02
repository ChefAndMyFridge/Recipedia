import "@/components/common/modal/Modal.css";

import { useRef, useEffect } from "react";

import useModalStore from "@stores/modalStore.ts";

const Modal = () => {
  const { isOpen, isClosing, modalContent, closeModal } = useModalStore();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isClosing) return; // 모달이 닫히는 중이면 아무것도 하지 않음

    if (isOpen && dialog.current) {
      dialog.current.showModal(); // 모달 열기
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && dialog.current) {
      dialog.current.close(); // 모달 닫기 (isClosing 애니메이션 후)
    }
  }, [isOpen]);

  function handleClose() {
    closeModal();
  }

  return (
    <dialog
      ref={dialog}
      onClose={handleClose}
      className={`fixed top-0 z-50 mx-auto w-full rounded-b-xl ${isClosing ? "is-closing" : ""}`}
      style={{ maxWidth: "clamp(344px, 100vw, 576px)" }}
    >
      {modalContent}
    </dialog>
  );
};

export default Modal;
