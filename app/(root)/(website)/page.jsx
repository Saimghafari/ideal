import BakeryHome from "@/components/Application/Website/Home/BakeryHome";

const HOME_TITLE = "Super Ideal Sweets & Bakers";
const HOME_DESCRIPTION =
  "More than sweets, it's a feeling. Fresh bakery, mithai, biscuits, and gift boxes from Super Ideal in Faisalabad.";

export const metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function Home() {
  return <BakeryHome />;
}
