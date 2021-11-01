import React, { useState, useContext } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal
        // openReviewModal,
        // closeReviewModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// custom hook
export const useGobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
