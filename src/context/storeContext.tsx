"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
interface StoreContextProps {
    children: React.ReactNode;
}

export default function StoreContextProvider({ children }: StoreContextProps) {
    return <Provider store={store}>{children}</Provider>;
}
