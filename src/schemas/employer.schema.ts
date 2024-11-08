import { z } from "zod";
import { AddressValidator } from "./address.schema";

export const EmployerValidator = z.object({
  company_name: z.string().max(100),
  fantasy_name: z.string().max(100),
  cnpj: z.string().min(14).max(18),
  address: z.optional(AddressValidator),
  // id: z.string().optional(),
});