import React from "react";
import { create } from "zustand";

interface ModalState {
  // isOpen: 모달이 열려있는지 여부, modalContent: 모달에 렌더링할 컴포넌트트, openModal: 모달 열기 함수, closeModal: 모달 닫기 함수
  isOpen: boolean;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalContent: null,
  openModal: (content) => set({ isOpen: true, modalContent: content }),
  closeModal: () => set({ isOpen: false, modalContent: null }),
}));

export default useModalStore;
