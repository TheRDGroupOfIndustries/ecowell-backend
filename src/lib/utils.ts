import axios from "axios";
import { toast } from "react-toastify";

export const generateRandomSku = (length: number = 8): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};
export const generateSlug = (name: string): string => {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
  return slug;
};

export const capitalizeHeader = (str: string): string => {
  return str
    ?.split(/[_-\s\/]+/)
    ?.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get("/api/categories/all-categories");
    let categoriesToShow = response.data.map((category: any) => {
      return { title: category.title, slug: category.slug };
    });
    return categoriesToShow;
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("Failed to fetch categories");
  } finally {
  }
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  // padding single digits with leading zeros
  const pad = (num: number) => (num < 10 ? `0${num}` : num);

  const day = pad(date.getUTCDate());
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getUTCMonth()];
  const year = String(date.getUTCFullYear()).slice(-2); // Get last two digits of the year

  return `${month} ${day}, ${year}`;
};

export const formatEarnings = (num: number): number => {
  if (num >= 1_000_000) {
    return Math.round(num / 1_000_000); // millions (M)
  } else if (num >= 1_000) {
    return Math.round(num / 1_000); // thousands (K)
  } else {
    return num; // original number
  }
};
