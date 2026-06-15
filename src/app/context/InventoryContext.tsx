"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

const InventoryContext =
  createContext<any>(null);

export function InventoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [stock, setStock] =
    useState<any>({

      "Small Iruka": 50,

      "Small Rosy": 40,

      "Medium Iruka": 70,

      "Medium Rosy": 60,

      "Big Smart": 45,

      "Classic Iruka": 30,

      "Classic Fruits": 25,

      "Jumbo Iruka": 80,

      "Jumbo Fruits": 35,

      "Big Brother Family": 20,
    });

  const addStock = (
    bread: string,
    quantity: number
  ) => {

    setStock((prev: any) => ({

      ...prev,

      [bread]:
        prev[bread] + quantity,
    }));
  };

  const reduceStock = (
    bread: string,
    quantity: number
  ) => {

    setStock((prev: any) => ({

      ...prev,

      [bread]:
        prev[bread] - quantity,
    }));
  };

  return (

    <InventoryContext.Provider
      value={{

        stock,

        addStock,

        reduceStock,
      }}
    >

      {children}

    </InventoryContext.Provider>

  );
}

export const useInventory = () =>
  useContext(InventoryContext);