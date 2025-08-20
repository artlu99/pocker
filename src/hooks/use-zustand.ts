import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";

export const useZustand = create(
    persist(combine(
        { isEvoluReady: false },
        (set) => ({ setIsEvoluReady: (isEvoluReady: boolean) => set({ isEvoluReady }) })
    ), {
        name: "zustand", storage: createJSONStorage(()=>sessionStorage)
    })
);
