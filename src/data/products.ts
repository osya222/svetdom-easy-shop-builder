import { Product } from "@/types/product";

export const products: Product[] = [
  // 50 товаров с лампочками LED E27
  { id: 1, name: "Лампа LED E27 9W", power: "9W", lightColor: "Теплый", price: 48, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [2] },
  { id: 2, name: "Лампа LED E27 7W", power: "7W", lightColor: "Холодный", price: 52, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [1] },
  { id: 3, name: "Лампа LED E27 11W", power: "11W", lightColor: "Нейтральный", price: 37, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [4] },
  { id: 4, name: "Лампа LED E27 6W", power: "6W", lightColor: "Теплый", price: 63, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [3] },
  { id: 5, name: "Лампа LED E27 8W", power: "8W", lightColor: "Холодный", price: 29, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [6] },
  
  { id: 6, name: "Лампа LED E27 12W", power: "12W", lightColor: "Нейтральный", price: 71, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [5] },
  { id: 7, name: "Лампа LED E27 10W", power: "10W", lightColor: "Теплый", price: 73, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [8] },
  { id: 8, name: "Лампа LED E27 9W", power: "9W", lightColor: "Холодный", price: 127, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [7] },
  { id: 9, name: "Лампа LED E27 13W", power: "13W", lightColor: "Нейтральный", price: 89, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [10] },
  { id: 10, name: "Лампа LED E27 5W", power: "5W", lightColor: "Теплый", price: 111, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [9] },
  
  { id: 11, name: "Лампа LED E27 14W", power: "14W", lightColor: "Холодный", price: 134, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [12] },
  { id: 12, name: "Лампа LED E27 7W", power: "7W", lightColor: "Нейтральный", price: 166, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [11] },
  { id: 13, name: "Лампа LED E27 11W", power: "11W", lightColor: "Теплый", price: 143, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [14] },
  { id: 14, name: "Лампа LED E27 8W", power: "8W", lightColor: "Холодный", price: 157, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [13] },
  { id: 15, name: "Лампа LED E27 15W", power: "15W", lightColor: "Нейтральный", price: 119, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [16] },
  
  { id: 16, name: "Лампа LED E27 6W", power: "6W", lightColor: "Теплый", price: 181, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [15] },
  { id: 17, name: "Лампа LED E27 12W", power: "12W", lightColor: "Холодный", price: 97, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [18] },
  { id: 18, name: "Лампа LED E27 9W", power: "9W", lightColor: "Нейтральный", price: 203, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [17] },
  { id: 19, name: "Лампа LED E27 10W", power: "10W", lightColor: "Теплый", price: 289, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [20] },
  { id: 20, name: "Лампа LED E27 7W", power: "7W", lightColor: "Холодный", price: 711, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [19] },
  
  { id: 21, name: "Лампа LED E27 13W", power: "13W", lightColor: "Нейтральный", price: 347, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [22] },
  { id: 22, name: "Лампа LED E27 11W", power: "11W", lightColor: "Теплый", price: 653, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [21] },
  { id: 23, name: "Лампа LED E27 8W", power: "8W", lightColor: "Холодный", price: 423, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [24] },
  { id: 24, name: "Лампа LED E27 14W", power: "14W", lightColor: "Нейтральный", price: 577, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [23] },
  { id: 25, name: "Лампа LED E27 6W", power: "6W", lightColor: "Теплый", price: 379, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [26] },
  
  { id: 26, name: "Лампа LED E27 15W", power: "15W", lightColor: "Холодный", price: 621, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [25] },
  { id: 27, name: "Лампа LED E27 9W", power: "9W", lightColor: "Нейтральный", price: 743, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [28] },
  { id: 28, name: "Лампа LED E27 12W", power: "12W", lightColor: "Теплый", price: 1257, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [27] },
  { id: 29, name: "Лампа LED E27 5W", power: "5W", lightColor: "Холодный", price: 891, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [30] },
  { id: 30, name: "Лампа LED E27 10W", power: "10W", lightColor: "Нейтральный", price: 1109, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [29] },
  
  { id: 31, name: "Лампа LED E27 7W", power: "7W", lightColor: "Теплый", price: 567, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [32] },
  { id: 32, name: "Лампа LED E27 11W", power: "11W", lightColor: "Холодный", price: 1433, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [31] },
  { id: 33, name: "Лампа LED E27 13W", power: "13W", lightColor: "Нейтральный", price: 1347, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [34] },
  { id: 34, name: "Лампа LED E27 8W", power: "8W", lightColor: "Теплый", price: 1653, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [33] },
  { id: 35, name: "Лампа LED E27 14W", power: "14W", lightColor: "Холодный", price: 1289, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [36] },
  
  { id: 36, name: "Лампа LED E27 6W", power: "6W", lightColor: "Нейтральный", price: 1711, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [35] },
  { id: 37, name: "Лампа LED E27 15W", power: "15W", lightColor: "Теплый", price: 59, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [38] },
  { id: 38, name: "Лампа LED E27 9W", power: "9W", lightColor: "Холодный", price: 41, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [37] },
  { id: 39, name: "Лампа LED E27 12W", power: "12W", lightColor: "Нейтральный", price: 67, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [40] },
  { id: 40, name: "Лампа LED E27 5W", power: "5W", lightColor: "Теплый", price: 133, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [39] },
  
  { id: 41, name: "Лампа LED E27 10W", power: "10W", lightColor: "Холодный", price: 83, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [42] },
  { id: 42, name: "Лампа LED E27 7W", power: "7W", lightColor: "Нейтральный", price: 117, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [41] },
  { id: 43, name: "Лампа LED E27 11W", power: "11W", lightColor: "Теплый", price: 91, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [44] },
  { id: 44, name: "Лампа LED E27 13W", power: "13W", lightColor: "Холодный", price: 209, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [43] },
  { id: 45, name: "Лампа LED E27 8W", power: "8W", lightColor: "Нейтральный", price: 149, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [46] },
  
  { id: 46, name: "Лампа LED E27 14W", power: "14W", lightColor: "Теплый", price: 151, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [45] },
  { id: 47, name: "Лампа LED E27 6W", power: "6W", lightColor: "Холодный", price: 193, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [48] },
  { id: 48, name: "Лампа LED E27 15W", power: "15W", lightColor: "Нейтральный", price: 107, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [47] },
  { id: 49, name: "Лампа LED E27 9W", power: "9W", lightColor: "Теплый", price: 173, image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80", category: "led", compatibleWith: [50] },
  { id: 50, name: "Лампа LED E27 12W", power: "12W", lightColor: "Холодный", price: 127, image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80", category: "led", compatibleWith: [49] }
];

export const targetSums = [100, 200, 300, 1000, 2000, 3000, 4000];

export const readySets = [
  {
    id: 1,
    name: "Базовый набор 1000₽",
    price: 1000,
    products: [19, 20, 21],
    description: "3 лампы для основного освещения"
  },
  {
    id: 2,
    name: "Комплект 2000₽",
    price: 2000,
    products: [27, 28, 29, 30],
    description: "4 лампы разной мощности"
  },
  {
    id: 3,
    name: "Полный набор 3000₽",
    price: 3000,
    products: [33, 34, 35, 36],
    description: "4 мощные лампы премиум класса"
  },
  {
    id: 4,
    name: "Профессиональный набор 4000₽",
    price: 4000,
    products: [31, 32, 21, 22, 23],
    description: "5 ламп для профессионального освещения"
  },
  {
    id: 5,
    name: "Максимальный набор 5000₽",
    price: 5000,
    products: [27, 28, 33, 34, 35],
    description: "5 топовых ламп максимальной мощности"
  }
];