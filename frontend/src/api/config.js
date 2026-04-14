import axios from "axios";
import { normalizeCategories, normalizeLanguages } from "@/components/utils/normalizeCategories";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export async function fetchCategories() {
  const res = await axios.get(`${API_URL}/config/categories`);
  return normalizeCategories(res.data); 
}

export async function fetchLanguages() {
  const res = await axios.get(`${API_URL}/config/languages`);
  return normalizeLanguages(res.data);
}