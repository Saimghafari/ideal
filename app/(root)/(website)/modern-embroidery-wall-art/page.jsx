import { redirect } from "next/navigation";

export default function LegacyAccessoriesRedirect() {
  redirect("/shop?category=gift-boxes");
}
