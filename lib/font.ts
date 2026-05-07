import { Meow_Script, Poppins } from "next/font/google";

export const meowScript = Meow_Script({
  subsets: ["latin"],
  weight: "400",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});