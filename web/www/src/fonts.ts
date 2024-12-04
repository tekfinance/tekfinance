import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

// export const defaultFont = localFont({
//   src: [
//     {
//       path: "./assets/fonts/ClashDisplay-Variable.ttf",
//     },
//   ],
// });

export const defaultFont = Montserrat({ subsets: ["latin"] });
