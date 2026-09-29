"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/ButtonLoading";
import HomeMediaPicker from "@/components/Application/Admin/HomeMediaPicker";
import Loading from "@/components/Application/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import {
  ADMIN_DASHBOARD,
  ADMIN_HOMEPAGE,
  ADMIN_HOMEPAGE_REELS,
} from "@/routes/AdminPanelRoute";

const labels = {
  after_sweets: "Videos after Sweets",
  after_bakery: "Videos after Bakery",
};

const toMedia = (media) =>
  media?._id && media?.secure_url
    ? { _id: String(media._id), url: media.secure_url }
    : null;

const EditHomeReels = ({ params }) => {
  const { placement } = use(params);
  const { data, loading } = useFetch(
    placement ? `/api/home-reel-section/get/${placement}` : null
  );
  const { data: productsData } = useFetch("/api/home-content/products");
  const products = productsData?.data || [];
  const [saving, setSaving] = useState(false);
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const section = data?.data;
    if (!section) return;
    setReels(
      (section.reels || []).map((reel) => ({
        productSlug: reel.productSlug || "",
        productId: reel.product ? String(reel.product) : "",
        videoUrl: reel.videoUrl || "",
        posterUrl: reel.posterUrl || "",
        posterMedia: toMedia(reel.poster),
        isActive: reel.isActive !== false,
      }))
    );
  }, [data]);

  const updateReel = (index, patch) => {
    setReels((current) =>
      current.map((reel, reelIndex) =>
        reelIndex === index ? { ...reel, ...patch } : reel
      )
    );
  };

  const addReel = () => {
    setReels((current) => [
      ...current,
      {
        productSlug: products[0]?.slug || "",
        productId: "",
        videoUrl: "",
        posterUrl: "",
        posterMedia: null,
        isActive: true,
      },
    ]);
  };

  const removeReel = (index) => {
    setReels((current) => current.filter((_, reelIndex) => reelIndex !== index));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data: response } = await axios.put("/api/home-reel-section/update", {
        placement,
        reels: reels.map((reel) => ({
          productSlug: reel.productSlug,
          productId: reel.productId || null,
          videoUrl: reel.videoUrl,
          posterUrl: reel.posterUrl,
          posterMedia: reel.posterMedia?._id || null,
          isActive: reel.isActive,
        })),
      });
      if (!response.success) throw new Error(response.message);
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!["after_sweets", "after_bakery"].includes(placement)) {
    return <p className="pt-6">This homepage section does not exist.</p>;
  }

  if (loading && !data) {
    return <Loading />;
  }

  return (
    <div>
      <BreadCrumb
        breadcrumbData={[
          { href: ADMIN_DASHBOARD, label: "Home" },
          { href: ADMIN_HOMEPAGE, label: "Homepage" },
          { href: ADMIN_HOMEPAGE_REELS(placement), label: labels[placement] },
        ]}
      />
      <Card className="rounded py-0 shadow-sm">
        <CardHeader className="border-b px-3 pt-3 [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit {labels[placement]}</h4>
        </CardHeader>
        <CardContent className="pb-6 pt-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Choose a product, video URL, and optional poster image.
              </p>
              <button type="button" onClick={addReel} className="text-sm font-medium underline">
                Add video
              </button>
            </div>

            {reels.map((reel, index) => (
              <div key={`${reel.productSlug}-${index}`} className="rounded border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Video {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeReel(index)}
                    className="text-xs text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label>Product</Label>
                    <select
                      className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={reel.productSlug}
                      onChange={(e) => {
                        const selected = products.find((item) => item.slug === e.target.value);
                        updateReel(index, {
                          productSlug: e.target.value,
                          productId: selected?.source === "catalog" ? selected._id : "",
                        });
                      }}
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={`${product.source}-${product.slug}`} value={product.slug}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Video URL</Label>
                    <Input
                      className="mt-2"
                      placeholder="https://..."
                      value={reel.videoUrl}
                      onChange={(e) => updateReel(index, { videoUrl: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Poster image URL</Label>
                    <Input
                      className="mt-2"
                      placeholder="Optional poster image URL"
                      value={reel.posterUrl}
                      onChange={(e) => updateReel(index, { posterUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <HomeMediaPicker
                    value={reel.posterMedia}
                    onChange={(media) => updateReel(index, { posterMedia: media })}
                    label="Select poster image"
                  />
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={reel.isActive}
                    onChange={(e) => updateReel(index, { isActive: e.target.checked })}
                  />
                  Show on homepage
                </label>
              </div>
            ))}

            <ButtonLoading loading={saving} type="submit" text="Save videos" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditHomeReels;
