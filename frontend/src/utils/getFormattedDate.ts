import { Ingredients } from "@/types/ingredientsTypes";

export function getCurrentDate(): string {
  const date = new Date();

  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours24 = date.getHours();
  const ampm = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${ampm} ${String(hours12).padStart(2, "0")}:${minutes}`;
}

// 추후 날짜 값이 들어오면 통합할 예정
export function calculateDaysRemaining(ingredient: Ingredients): number {
  if (!ingredient.ingredients) return 1000;

  const today = new Date();
  const expirationDate = new Date(ingredient.ingredients[0].expirationDate);

  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
