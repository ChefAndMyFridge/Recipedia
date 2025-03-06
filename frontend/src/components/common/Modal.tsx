import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import useModalStore from "@/stores/modalStore.ts";

interface ModalStoreState {
  isOpen: boolean;
  modalContent: React.ReactNode | null;
  closeModal: () => void;
}

const Modal = () => {
  const { isOpen, modalContent, closeModal } = useModalStore() as ModalStoreState;
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = dialog.current;

    if (isOpen && modal && modalContent) {
      modal.showModal();
    }

    return () => {
      if (modal) modal.close();
    };
  }, [isOpen, modalContent]);

  // ESC, backdrop 클릭시에도 모달이 닫히도록
  const handleClose = () => {
    closeModal();
  };

  return createPortal(
    <dialog ref={dialog} onClose={handleClose}>
      {modalContent}
    </dialog>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default Modal;
