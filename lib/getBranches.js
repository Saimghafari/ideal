import { connectDB } from "@/lib/databaseConnection";
import { branches as staticBranches, SHOP_PHONE_DISPLAY, SHOP_PHONE_TEL } from "@/lib/locations";
import BranchModel from "@/models/Branch.model";
import MediaModel from "@/models/Media.model";

void MediaModel;

const FALLBACK_IMAGES = [
  "/assets/home/si-branch-saddar.png",
  "/assets/home/si-branch-dground.png",
  "/assets/home/si-branch-clock.png",
];

function phoneTel(phone) {
  const digits = String(phone || "").replace(/[^\d+]/g, "");
  return digits || SHOP_PHONE_TEL;
}

export function mapBranch(row, index = 0) {
  const image =
    row?.media?.secure_url ||
    row?.image ||
    FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return {
    id: row.slug || row.id,
    _id: row._id ? String(row._id) : "",
    name: row.name,
    short: row.shortName || row.short || row.name,
    address: row.address,
    hours: row.hours || "",
    image,
    summary: row.summary || "",
    phone: row.phone || SHOP_PHONE_DISPLAY,
    phoneTel: row.phone ? phoneTel(row.phone) : SHOP_PHONE_TEL,
    prepMinutes: row.prepMinutes === 10 ? 10 : 20,
  };
}

export async function getPublicBranches() {
  try {
    await connectDB();
    const rows = await BranchModel.find({ deletedAt: null, isActive: { $ne: false } })
      .populate({ path: "media", select: "secure_url" })
      .sort({ createdAt: 1 })
      .lean();

    if (!rows.length) return staticBranches.map((branch, index) => mapBranch(branch, index));
    return rows.map((row, index) => mapBranch(row, index));
  } catch {
    return staticBranches.map((branch, index) => mapBranch(branch, index));
  }
}
