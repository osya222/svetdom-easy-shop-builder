import { Product } from "@/types/product";

export const products: Product[] = [
  // Обычные LED
  { id: 1, name: "LED лампа 9W E27", power: "9W", lightColor: "Теплый белый", price: 127, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [2, 13] },
  { id: 2, name: "LED лампа 12W E27", power: "12W", lightColor: "Холодный белый", price: 173, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [1, 14] },
  { id: 3, name: "LED лампа 6W E14", power: "6W", lightColor: "Теплый белый", price: 89, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [4, 15] },
  { id: 4, name: "LED лампа 3W E14", power: "3W", lightColor: "Нейтральный", price: 61, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [3, 16] },
  { id: 5, name: "LED лампа 15W E27", power: "15W", lightColor: "Дневной свет", price: 234, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [6, 17] },
  { id: 6, name: "LED лампа 7W GU10", power: "7W", lightColor: "Теплый белый", price: 116, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [5, 18] },
  { id: 7, name: "LED лампа 10W E27", power: "10W", lightColor: "RGB", price: 289, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [8, 19] },
  { id: 8, name: "LED лампа 4W E14", power: "4W", lightColor: "Винтаж", price: 111, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [7, 20] },

  // Аварийные
  { id: 9, name: "Аварийная LED 12W", power: "12W", lightColor: "Белый", price: 347, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "emergency", compatibleWith: [10, 21] },
  { id: 10, name: "Аварийная LED 9W", power: "9W", lightColor: "Теплый", price: 253, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "emergency", compatibleWith: [9, 22] },
  { id: 11, name: "Аварийная LED 6W", power: "6W", lightColor: "Холодный", price: 197, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "emergency", compatibleWith: [12, 23] },
  { id: 12, name: "Портативная LED", power: "3W", lightColor: "Белый", price: 143, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "emergency", compatibleWith: [11, 24] },

  // Декоративные
  { id: 13, name: "LED свеча E14", power: "3W", lightColor: "Теплый", price: 73, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [1, 25] },
  { id: 14, name: "LED шар G45", power: "4W", lightColor: "Мультицвет", price: 127, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [2, 26] },
  { id: 15, name: "LED филамент ST64", power: "6W", lightColor: "Янтарный", price: 161, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [3, 27] },
  { id: 16, name: "LED гирлянда", power: "5W", lightColor: "Теплый", price: 239, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [4, 28] },

  // Дополнительные товары для разнообразия
  { id: 17, name: "LED лампа умная", power: "11W", lightColor: "Управляемый", price: 366, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [5, 29] },
  { id: 18, name: "LED спот 5W", power: "5W", lightColor: "Нейтральный", price: 84, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [6, 30] },
  { id: 19, name: "LED диммируемая", power: "8W", lightColor: "Теплый", price: 211, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [7, 31] },
  { id: 20, name: "LED винтаж Edison", power: "4W", lightColor: "Янтарный", price: 189, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [8, 32] },

  // Готовые наборы
  { id: 21, name: "Набор для кухни", power: "Микс", lightColor: "Теплый", price: 653, image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80", category: "set", compatibleWith: [9, 33] },
  { id: 22, name: "Набор для спальни", power: "Микс", lightColor: "Приглушенный", price: 347, image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80", category: "set", compatibleWith: [10, 34] },
  { id: 23, name: "Набор для дачи", power: "Микс", lightColor: "Белый", price: 403, image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80", category: "set", compatibleWith: [11, 35] },

  // Еще товары для полноты ассортимента
  { id: 24, name: "LED G4 капсула", power: "2W", lightColor: "Теплый", price: 57, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [12, 36] },
  { id: 25, name: "LED лента 5м", power: "24W", lightColor: "RGB", price: 427, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [13, 37] },
  { id: 26, name: "LED прожектор", power: "50W", lightColor: "Холодный", price: 573, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [14, 38] },
  { id: 27, name: "LED ночник", power: "1W", lightColor: "Мягкий", price: 39, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [15, 39] },
  { id: 28, name: "LED панель круглая", power: "18W", lightColor: "Дневной", price: 361, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [16, 40] },
  { id: 29, name: "LED точечный", power: "3W", lightColor: "Нейтральный", price: 134, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [17, 41] },
  { id: 30, name: "LED трубка T8", power: "20W", lightColor: "Белый", price: 516, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [18, 42] },

  // Дополняем до 35-40 товаров
  { id: 31, name: "LED MR16 спот", power: "5W", lightColor: "Теплый", price: 89, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [19] },
  { id: 32, name: "LED свеча на ветру", power: "4W", lightColor: "Мерцающий", price: 111, image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80", category: "decorative", compatibleWith: [20] },
  { id: 33, name: "LED аварийный фонарь", power: "15W", lightColor: "Белый", price: 347, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "emergency", compatibleWith: [21] },
  { id: 34, name: "LED умная цветная", power: "10W", lightColor: "16млн цветов", price: 653, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [22] },
  { id: 35, name: "LED зеркальная R63", power: "8W", lightColor: "Теплый", price: 197, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [23] },
];

export const targetSums = [100, 200, 300, 500, 1000, 2000, 3000];