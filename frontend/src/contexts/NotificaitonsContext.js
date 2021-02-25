import React, { createContext, useContext } from "react";

const NotificationsContext = createContext({});

export default function NotificationProvider({ children, value }) {
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationsContext);
}
