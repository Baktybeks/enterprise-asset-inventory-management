import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client, Databases, ID, Query } from "appwrite";

// Константы для Appwrite
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "";
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || "";
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "";

// Вывод информации о переменных окружения
console.log("===== APPWRITE CONFIG =====");
console.log(`DATABASE_ID: ${DATABASE_ID}`);
console.log(`COLLECTION_ID: ${COLLECTION_ID}`);
console.log(`PROJECT_ID: ${PROJECT_ID}`);
console.log(`PROJECT_ID: ${ENDPOINT}`);
console.log("==========================");

// Инициализация клиента Appwrite
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const database = new Databases(client);

// Определение интерфейса для товара
export interface InventoryItem {
  $id?: string;
  id?: string;
  name: string;
  category: string;
  barcode: string;
  quantity: number;
  price: number;
  lastUpdated?: string;
}

// Проверка доступа к коллекции
export const initializeAppwrite = async (): Promise<boolean> => {
  try {
    console.log("Проверяем доступ к коллекции...");

    // Пробуем получить список документов
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(1),
    ]);

    console.log(
      "Успешно получен список документов:",
      result.total ? `Найдено ${result.total} документов` : "Нет документов"
    );
    return true;
  } catch (error) {
    console.error("Ошибка при инициализации Appwrite:", error);
    return false;
  }
};

// API функции для работы с инвентарем
export const inventoryApi = {
  // Получить все товары
  getAllItems: async (): Promise<InventoryItem[]> => {
    try {
      console.log(`Загрузка товаров из коллекции ${COLLECTION_ID}...`);

      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID);

      console.log(`Получено ${result.total} товаров`);

      return result.documents.map((item) => ({
        ...item,
        id: item.$id,
      })) as unknown as InventoryItem[];
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
      return [];
    }
  },

  // Получить товар по ID
  getItemById: async (id: string): Promise<InventoryItem | null> => {
    try {
      console.log(`Получение товара с ID ${id}...`);

      const result = await database.getDocument(DATABASE_ID, COLLECTION_ID, id);

      return {
        ...result,
        id: result.$id,
      } as unknown as InventoryItem;
    } catch (error) {
      console.error(`Ошибка при получении товара с ID ${id}:`, error);
      return null;
    }
  },

  getItemByBarcode: async (barcode: string): Promise<InventoryItem | null> => {
    try {
      console.log(`Поиск товара по штрихкоду ${barcode}...`);
      const cacheBreaker = new Date().getTime();

      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("barcode", barcode),
        Query.greaterThan("$createdAt", "2000-01-01T00:00:00.000Z"),
        Query.limit(100),
      ]);

      if (result.documents.length > 0) {
        const item = result.documents[0];
        try {
          await database.getDocument(DATABASE_ID, COLLECTION_ID, item.$id);
          return {
            ...item,
            id: item.$id,
          } as unknown as InventoryItem;
        } catch (getDocError) {
          console.log(`Документ с ID ${item.$id} не найден при проверке`);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error(`Ошибка при поиске товара по штрихкоду ${barcode}:`, error);
      return null;
    }
  },

  // Поиск товаров
  searchItems: async (query: string): Promise<InventoryItem[]> => {
    try {
      console.log(`Поиск товаров по запросу "${query}"...`);

      if (!query.trim()) {
        return inventoryApi.getAllItems();
      }

      const normalizedQuery = query.toLowerCase().trim();

      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.search("name", normalizedQuery),
        Query.limit(100),
      ]);

      return result.documents.map((item) => ({
        ...item,
        id: item.$id,
      })) as unknown as InventoryItem[];
    } catch (error) {
      console.error(`Ошибка при поиске товаров по запросу "${query}":`, error);
      return [];
    }
  },

  // Добавить новый товар
  addItem: async (
    item: Omit<InventoryItem, "$id" | "lastUpdated">
  ): Promise<InventoryItem> => {
    try {
      console.log(`Добавление нового товара: ${item.name}...`);

      const newItem = {
        ...item,
        lastUpdated: new Date().toISOString(),
      };

      const result = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        newItem
      );

      return {
        ...result,
        id: result.$id,
      } as unknown as InventoryItem;
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
      throw error;
    }
  },

  // Обновить существующий товар
  updateItem: async (
    id: string,
    updates: Partial<InventoryItem>
  ): Promise<InventoryItem> => {
    try {
      console.log(`Обновление товара с ID ${id}...`);

      const updatedItemData = {
        ...updates,
        lastUpdated: new Date().toISOString(),
      };

      const result = await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updatedItemData
      );

      return {
        ...result,
        id: result.$id,
      } as unknown as InventoryItem;
    } catch (error) {
      console.error(`Ошибка при обновлении товара с ID ${id}:`, error);
      throw error;
    }
  },

  // Удалить товар
  deleteItem: async (id: string): Promise<boolean> => {
    try {
      console.log(`Удаление товара с ID ${id}...`);

      await database.deleteDocument(DATABASE_ID, COLLECTION_ID, id);

      return true;
    } catch (error) {
      console.error(`Ошибка при удалении товара с ID ${id}:`, error);
      return false;
    }
  },
};

// Ключи для React Query
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  barcode: (barcode: string) =>
    [...inventoryKeys.all, "barcode", barcode] as const,
  search: (query: string) => [...inventoryKeys.all, "search", query] as const,
};

// React Query хуки
export const useInventoryItems = () => {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: inventoryApi.getAllItems,
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: async () => {
      try {
        const item = await inventoryApi.getItemById(id);
        return item || null;
      } catch (error) {
        console.error(`Ошибка в хуке useInventoryItem: ${error}`);
        return null;
      }
    },
    enabled: !!id,
  });
};

export const useInventoryItemByBarcode = (barcode: string, options = {}) => {
  return useQuery({
    queryKey: inventoryKeys.barcode(barcode),
    queryFn: () => inventoryApi.getItemByBarcode(barcode),
    enabled: !!barcode,
    retry: false,
    ...options,
  });
};

export const useSearchInventory = (query: string) => {
  return useQuery({
    queryKey: inventoryKeys.search(query),
    queryFn: () => inventoryApi.searchItems(query),
    enabled: !!query,
  });
};

export const useAddInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: Omit<InventoryItem, "$id" | "lastUpdated">) =>
      inventoryApi.addItem(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<InventoryItem>;
    }) => inventoryApi.updateItem(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Сначала получаем товар, чтобы узнать его штрихкод
        const item = await inventoryApi.getItemById(id);
        const barcode = item?.barcode;

        // Удаляем товар
        const result = await inventoryApi.deleteItem(id);

        // Если есть штрихкод, запоминаем его для инвалидации
        if (barcode) {
          // Можно сохранить в локальное хранилище список удаленных штрихкодов
          // или инвалидировать конкретный запрос по штрихкоду
          queryClient.invalidateQueries({
            queryKey: inventoryKeys.barcode(barcode),
          });
        }

        return result;
      } catch (error) {
        console.error("Ошибка в процессе удаления товара:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Инвалидируем все кеши
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

// Хук-обертка, имитирующий старый интерфейс для совместимости
export const useInventory = () => {
  const { data: items = [], isLoading: loading, error } = useInventoryItems();
  const addItemMutation = useAddInventoryItem();
  const updateItemMutation = useUpdateInventoryItem();
  const deleteItemMutation = useDeleteInventoryItem();

  // Локальный поиск товаров
  const searchItems = (query: string): InventoryItem[] => {
    if (!query.trim()) return items;

    const normalizedQuery = query.toLowerCase().trim();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.barcode.includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
    );
  };

  // Поиск товара по ID в локальных данных
  const getItemById = (id: string): InventoryItem | undefined => {
    return items.find((item) => item.id === id || item.$id === id);
  };

  // Поиск товара по штрихкоду в локальных данных
  const getItemByBarcode = (barcode: string): InventoryItem | undefined => {
    return items.find((item) => item.barcode === barcode);
  };

  return {
    items,
    loading,
    error,
    searchItems,
    getItemById,
    getItemByBarcode,
    addItem: addItemMutation.mutateAsync,
    updateItem: (id: string, updates: Partial<InventoryItem>) =>
      updateItemMutation.mutateAsync({ id, updates }),
    deleteItem: deleteItemMutation.mutateAsync,
  };
};
