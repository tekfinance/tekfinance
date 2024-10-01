import {
  type InitDataParsed,
  parse,
  validate,
} from "@telegram-apps/init-data-node";
import passportCustom, { type VerifiedCallback } from "passport-custom";

export const TelegramStrategy = (
  authToken: string,
  verify: (payload: NonNullable<InitDataParsed>, done: VerifiedCallback) => void
) =>
  new passportCustom.Strategy((req, next) => {
    if (req.headers.authorization) {
      const [flag, authData] = req.headers.authorization.split(" ");
      switch (flag.toLowerCase()) {
        case "tma":
          try {
            validate(authData, authToken);
            return verify(parse(authData), next);
          } catch (error) {
            return next(error);
          }
        default:
          return next(new Error("Unsupported authorization flag. Tma expected"));
      }
    }

    return next(new Error("Tma strategy not supported."));
  });
