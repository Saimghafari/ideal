import { redirect } from "next/navigation";

export default function LegacyWomenRedirect() {
  redirect("/shop?category=sweets");
}
