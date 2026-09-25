import Link from "next/link";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { connectDB } from "@/lib/databaseConnection";
import { seedHomeContentIfNeeded } from "@/lib/homeContentService";
import { getStaticProducts } from "@/lib/staticCatalog";
import {
  ADMIN_DASHBOARD,
  ADMIN_HOMEPAGE,
  ADMIN_HOMEPAGE_COLLECTION,
  ADMIN_HOMEPAGE_REELS,
} from "@/routes/AdminPanelRoute";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_HOMEPAGE, label: "Homepage" },
];

const sections = [
  {
    title: "Men's Collection",
    text: "Left image, heading, and category cards on the homepage.",
    href: ADMIN_HOMEPAGE_COLLECTION("men"),
  },
  {
    title: "Videos after Men",
    text: "Product video row shown under Men's Collections.",
    href: ADMIN_HOMEPAGE_REELS("after_men"),
  },
  {
    title: "Women's Collection",
    text: "Left image, heading, and category cards on the homepage.",
    href: ADMIN_HOMEPAGE_COLLECTION("women"),
  },
  {
    title: "Videos after Women",
    text: "Product video row shown under Women's Collections.",
    href: ADMIN_HOMEPAGE_REELS("after_women"),
  },
];

const HomepageAdmin = async () => {
  try {
    await connectDB();
    await seedHomeContentIfNeeded(getStaticProducts());
  } catch {
    // Forms still work after the first successful API save.
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="rounded py-0 shadow-sm">
        <CardHeader className="border-b px-3 pt-3 [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Homepage sections</h4>
        </CardHeader>
        <CardContent className="grid gap-4 py-6 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-lg border p-5 transition-colors hover:bg-muted/40"
            >
              <h5 className="text-lg font-semibold">{section.title}</h5>
              <p className="mt-2 text-sm text-muted-foreground">{section.text}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageAdmin;
