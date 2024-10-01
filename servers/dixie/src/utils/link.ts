export const InternalLinkParams = {
  referDelimeter: "refer" as const,
  redeemDelimeter: "redeem" as const,
  redeemValue(id: string | number) {
    return "redeem=" + id;
  },
  referValue(id: string | number) {
    return "refer=" + id;
  },
};
