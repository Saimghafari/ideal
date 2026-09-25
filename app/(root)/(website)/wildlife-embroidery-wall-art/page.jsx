import { redirect } from "next/navigation";

export default function LegacyMenRedirect() {
  redirect("/shop?category=men");
}
