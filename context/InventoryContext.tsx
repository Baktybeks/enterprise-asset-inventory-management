import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Определение интерфейса для товара
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  barcode: string;
  quantity: number;
  price: number;
  lastUpdated?: string;
  image?: string;
}

// Начальные данные для примера
const initialInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Ноутбук Lenovo ThinkPad X1",
    quantity: 5,
    price: 120000,
    category: "Техника",
    barcode: "4800888123451",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Стол офисный",
    quantity: 10,
    price: 15000,
    category: "Мебель",
    barcode: "4800888123452",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Стул эргономичный",
    quantity: 15,
    price: 8000,
    category: "Мебель",
    barcode: "4800888123453",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "МФУ HP LaserJet Pro",
    quantity: 3,
    price: 35000,
    category: "Техника",
    barcode: "4800888123454",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    name: 'Монитор Dell 27"',
    quantity: 8,
    price: 25000,
    category: "Техника",
    barcode: "4800888123455",
    lastUpdated: new Date().toISOString(),
  },
];

// Интерфейс контекста инвентаря
interface InventoryContextType {
  items: InventoryItem[];
  addItem: (
    item: Omit<InventoryItem, "id" | "lastUpdated">
  ) => Promise<InventoryItem>;
  updateItem: (
    id: string,
    updates: Partial<InventoryItem>
  ) => Promise<InventoryItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  getItemById: (id: string) => InventoryItem | undefined;
  getItemByBarcode: (barcode: string) => InventoryItem | undefined;
  searchItems: (query: string) => InventoryItem[];
  loading: boolean;
  error: string | null;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const storedItems = await AsyncStorage.getItem("inventoryItems");

        if (storedItems) {
          setItems(JSON.parse(storedItems));
        } else {
          setItems(initialInventoryItems);
          await AsyncStorage.setItem(
            "inventoryItems",
            JSON.stringify(initialInventoryItems)
          );
        }
      } catch (err) {
        setError(
          "Ошибка при загрузке данных: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        if (items.length > 0) {
          await AsyncStorage.setItem("inventoryItems", JSON.stringify(items));
        }
      } catch (err) {
        setError(
          "Ошибка при сохранении данных: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
    };

    if (!loading && items.length > 0) {
      saveData();
    }
  }, [items, loading]);

  const addItem = async (
    item: Omit<InventoryItem, "id" | "lastUpdated">
  ): Promise<InventoryItem> => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };

    setItems((prevItems) => [...prevItems, newItem]);
    return newItem;
  };

  const updateItem = async (
    id: string,
    updates: Partial<InventoryItem>
  ): Promise<InventoryItem | null> => {
    let updatedItem: InventoryItem | null = null;

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          updatedItem = {
            ...item,
            ...updates,
            lastUpdated: new Date().toISOString(),
          };
          return updatedItem;
        }
        return item;
      });

      return updatedItems;
    });

    return updatedItem;
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    return true;
  };

  const getItemById = (id: string): InventoryItem | undefined => {
    return items.find((item) => item.id === id);
  };

  const getItemByBarcode = (barcode: string): InventoryItem | undefined => {
    return items.find((item) => item.barcode === barcode);
  };

  const searchItems = (query: string): InventoryItem[] => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.barcode.includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
    );
  };

  const value = {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemByBarcode,
    searchItems,
    loading,
    error,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);

  if (context === undefined) {
    throw new Error(
      "useInventory должен использоваться внутри InventoryProvider"
    );
  }

  return context;
};
