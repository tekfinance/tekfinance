type Enum<T extends Readonly<object>> = Readonly<[T[keyof T]]>;

export const Chain = {
  SOLANA: "solana",
  ETHEREUM: "ethereum",
} as const;

export const ChainEnum = Object.values(Chain) as unknown as Enum<typeof Chain>;

export const Task = {
  TIP: "tip",
  REFER: "refer",
  COUPON: "coupon",
} as const;

export const TaskEnum = Object.values(Task) as unknown as Enum<typeof Task>;

export const Locale = {
  ENGLISH: "en",
} as const;

export const LocaleEnum = Object.values(Locale) as unknown as Enum<
  typeof Locale
>;

export const Status = {
  IDLE: "idle",
  PENDING: "pending",
  ERROR: "error",
  SUCCESS: "success",
} as const;

export const StatusEnum = Object.values(Status) as unknown as Enum<
  typeof Status
>;

export const Social = {
  TELEGRAM: "telegram",
  DISCORD: "discord",
} as const;

export const SocialEnum = Object.values(Social) as unknown as Enum<
  typeof Social
>;

