import { z } from "zod";

export const AddressValidator = z.object({
  postal_code: z.string().max(50),
  public_space: z.string().max(50),
  address_number: z.string().max(5),
  complement: z.string().max(20),
  city: z.string().max(100),
  state: z.string().max(100),
  country: z.string().max(100),
})