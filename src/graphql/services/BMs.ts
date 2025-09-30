import { useQuery } from "@apollo/client";
import { GET_BMS } from "../schemas/BMs";
import { TypesGetBMs } from "../types/BMs";

/**
 * Hook para buscar BMS
 */
export function useQueryBMs() {
  return useQuery<TypesGetBMs>(GET_BMS);
}