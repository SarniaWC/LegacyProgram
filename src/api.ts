import axios from "axios";
import { api_url } from "@/constants";

export const api = axios.create({
  baseURL: api_url,
});
