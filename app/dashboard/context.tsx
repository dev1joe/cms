"use client"

import { createContext, useContext } from "react";

type TDashboardContext = {
  userId: string
}

export const DashboardContext = createContext<TDashboardContext>({
  userId: "",
});

export const useDashboardContext = () => useContext(DashboardContext);
