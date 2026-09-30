"use client";

import ButtonLoading from "@/components/Application/ButtonLoading";
import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import userIcon from "@/public/assets/images/user.png";
import { FaCamera } from "react-icons/fa";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import Link from "next/link";
import { USER_DASHBOARD, WEBSITE_HOME } from "@/routes/WebsiteRoute";

const inputClass =
  "h-12 rounded-2xl border-[#f1e3d4] bg-[#FFF8F2] px-4 text-[14.5px] font-medium text-[#3a2416] shadow-none placeholder:text-[#b7a498] focus-visible:border-[#E45700] focus-visible:ring-0";

const labelClass =
  "text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754]";

const Profile = () => {
  const dispatch = useDispatch();
  const { data: user } = useFetch("/api/profile/get");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();
  const formSchema = zSchema.pick({
    name: true,
    phone: true,
    address: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user && user.success) {
      const userData = user.data;
      form.reset({
        name: userData?.name,
        phone: userData?.phone,
        address: userData?.address,
      });

      setPreview(userData?.avatar?.url);
    }
  }, [user]);

  const handleFileSelection = (files) => {
    const selected = files[0];
    const objectUrl = URL.createObjectURL(selected);
    setPreview(objectUrl);
    setFile(selected);
  };

  const updateProfile = async (values) => {
    setLoading(true);
    try {
      let formData = new FormData();
      if (file) {
        formData.set("file", file);
      }
      formData.set("name", values.name);
      formData.set("phone", values.phone);
      formData.set("address", values.address);

      const { data: response } = await axios.put(
        "/api/profile/update",
        formData
      );
      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
      dispatch(login(response.data));
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserPanelLayout>
      <div className="min-w-0 font-ui text-[#3a2416]">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[#8a6754]"
        >
          <Link href={WEBSITE_HOME} className="hover:text-[#E45700]">
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link href={USER_DASHBOARD} className="hover:text-[#E45700]">
            Account
          </Link>
          <span aria-hidden="true">›</span>
          <span className="font-medium text-[#3a2416]">Profile</span>
        </nav>

        <header className="max-w-xl">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[#E45700] sm:text-[12.5px]">
            Super Ideal
          </p>
          <h1 className="font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#3a2416] min-[400px]:text-[2.15rem] sm:text-[2.55rem]">
            Edit your profile
          </h1>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-[#6b5142] sm:text-[15.5px]">
            Update your name, phone, and the address we use for delivery.
          </p>
        </header>

        <Form {...form}>
          <form
            className="mt-6 max-w-2xl rounded-[24px] border border-[#f1e3d4] bg-white p-4 shadow-[0_8px_22px_rgba(75,46,30,0.05)] sm:mt-8 sm:p-6"
            onSubmit={form.handleSubmit(updateProfile)}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Dropzone
                  onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="group cursor-pointer">
                      <input {...getInputProps()} />
                      <div className="relative w-fit">
                        <Avatar className="h-24 w-24 rounded-full border border-[#f1e3d4] bg-[#FFF8F2]">
                          <AvatarImage
                            src={preview ? preview : userIcon.src}
                            className="object-cover"
                          />
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#3a2416]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <FaCamera className="text-white" size={16} />
                        </div>
                      </div>
                      <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a6754] group-hover:text-[#E45700]">
                        Change photo
                      </p>
                    </div>
                  )}
                </Dropzone>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your name"
                        className={inputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contact number"
                        className={inputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Delivery address"
                          className={`${inputClass} min-h-[7rem] resize-y rounded-2xl py-3`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-1 md:col-span-2">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Save changes"
                  className="h-12 cursor-pointer rounded-full bg-[#E45700] px-7 text-[14.5px] font-bold text-white shadow-[0_8px_16px_rgba(228,87,0,0.28)] hover:bg-[#cf4c00]"
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </UserPanelLayout>
  );
};

export default Profile;
