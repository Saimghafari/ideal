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
  ADMIN_HOMEPAGE_COLLECTION,
} from "@/routes/AdminPanelRoute";

const labels = {
  men: "Men's Collection",
  women: "Women's Collection",
};

const toMedia = (media) =>
  media?._id && media?.secure_url
    ? { _id: String(media._id), url: media.secure_url }
    : null;

const EditHomeCollection = ({ params }) => {
  const { key } = use(params);
  const { data, loading } = useFetch(
    key ? `/api/home-gender-collection/get/${key}` : null
  );
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");
  const [featuredAlt, setFeaturedAlt] = useState("");
  const [featuredUrl, setFeaturedUrl] = useState("");
  const [featuredMedia, setFeaturedMedia] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const collection = data?.data;
    if (!collection) return;
    setTitle(collection.title || "");
    setHref(collection.href || "");
    setFeaturedAlt(collection.featuredAlt || "");
    setFeaturedUrl(collection.featuredUrl || "");
    setFeaturedMedia(toMedia(collection.featuredMedia));
    setItems(
      (collection.items || []).map((item) => ({
        key: item.key || "",
        title: item.title || "",
        href: item.href || "",
        alt: item.alt || "",
        url: item.url || "",
        media: toMedia(item.image),
      }))
    );
  }, [data]);

  const updateItem = (index, patch) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      { key: "", title: "", href: "/shop", alt: "", url: "", media: null },
    ]);
  };

  const removeItem = (index) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data: response } = await axios.put("/api/home-gender-collection/update", {
        key,
        title,
        href,
        featuredAlt,
        featuredUrl,
        featuredMedia: featuredMedia?._id || null,
        items: items.map((item) => ({
          key: item.key,
          title: item.title,
          href: item.href,
          alt: item.alt,
          url: item.url,
          media: item.media?._id || null,
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

  if (!["men", "women"].includes(key)) {
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
          { href: ADMIN_HOMEPAGE_COLLECTION(key), label: labels[key] },
        ]}
      />
      <Card className="rounded py-0 shadow-sm">
        <CardHeader className="border-b px-3 pt-3 [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit {labels[key]}</h4>
        </CardHeader>
        <CardContent className="pb-6 pt-5">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Section title</Label>
                <Input className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label>Section link</Label>
                <Input className="mt-2" value={href} onChange={(e) => setHref(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Main image</Label>
              <p className="mb-2 mt-1 text-xs text-muted-foreground">
                Choose an image from Media, or paste an image URL.
              </p>
              <HomeMediaPicker value={featuredMedia} onChange={setFeaturedMedia} />
              <Input
                className="mt-3"
                placeholder="Or paste image URL"
                value={featuredUrl}
                onChange={(e) => setFeaturedUrl(e.target.value)}
              />
              <Input
                className="mt-3"
                placeholder="Image alt text"
                value={featuredAlt}
                onChange={(e) => setFeaturedAlt(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold">Category cards</h5>
                <button type="button" onClick={addItem} className="text-sm font-medium underline">
                  Add card
                </button>
              </div>
              {items.map((item, index) => (
                <div key={`${item.key}-${index}`} className="rounded border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium">Card {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-xs text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => updateItem(index, { title: e.target.value })}
                    />
                    <Input
                      placeholder="Link"
                      value={item.href}
                      onChange={(e) => updateItem(index, { href: e.target.value })}
                    />
                    <Input
                      placeholder="Alt text"
                      value={item.alt}
                      onChange={(e) => updateItem(index, { alt: e.target.value })}
                    />
                    <Input
                      placeholder="Or paste image URL"
                      value={item.url}
                      onChange={(e) => updateItem(index, { url: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <HomeMediaPicker
                      value={item.media}
                      onChange={(media) => updateItem(index, { media })}
                      label="Select card image"
                    />
                  </div>
                </div>
              ))}
            </div>

            <ButtonLoading loading={saving} type="submit" text="Save collection" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditHomeCollection;
