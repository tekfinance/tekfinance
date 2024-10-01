import { z } from "zod";
import type { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";

export const selectMintSchema = z.object({
  id: z.any(),
  action: z.literal("selectMint"),
  type: z.literal("tip").or(z.literal("coupon")),
  data: z.custom<DigitalAssetWithToken>(() => true),
});

export const webDataSchema = z
  .object({
    action: z.literal("confirm"),
  })
  .or(selectMintSchema);
