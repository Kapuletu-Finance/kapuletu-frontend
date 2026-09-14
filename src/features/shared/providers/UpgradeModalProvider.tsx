"use client";

import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import UpgradeDialog from "@/features/shared/components/UpgradeDialog";

interface UpgradeModalContextProps {
  openModal: (message?: string) => void;
  closeModal: () => void;
}

const UpgradeModalContext = createContext<UpgradeModalContextProps | undefined>(undefined);

export const useUpgradeModal = () => {
  const context = useContext(UpgradeModalContext);
  if (!context) {
    throw new Error("useUpgradeModal must be used within an UpgradeModalProvider");
  }
  return context;
};

export const UpgradeModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Upgrade to manage your group funds without any limits.");

  const openModal = React.useCallback((customMessage?: string) => {
    if (customMessage) {
      setMessage(customMessage);
    }
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    // Listen for custom global event dispatched from api-client.ts
    const handleUpgradeRequired = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      openModal(customEvent.detail?.message);
    };

    window.addEventListener("upgrade_required", handleUpgradeRequired);

    return () => {
      window.removeEventListener("upgrade_required", handleUpgradeRequired);
    };
  }, [openModal]);

  return (
    <UpgradeModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <UpgradeDialog isOpen={isOpen} onClose={closeModal} message={message} />
    </UpgradeModalContext.Provider>
  );
};
