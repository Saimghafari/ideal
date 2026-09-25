"use client";

import ButtonLoading from "@/components/Application/ButtonLoading";
import UserPanelLayout from "@/components/Application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/Website/WebsiteBreadcrumb";
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

const breadCrumbData = {
  title: "My Profile",
  eyebrow: "Velora",
  subtitle: "Update your name, contact details, and delivery address.",
  links: [{ label: "Profile" }],
};

const inputClass =
  "h-11 rounded-none border border-[var(--si-mist)] bg-[var(--si-cream)] px-4 text-sm font-light text-[var(--si-deep-brown)] shadow-none placeholder:text-[var(--si-fog)] focus-visible:ring-0 focus-visible:border-[var(--si-burnt-orange)] transition-colors duration-300";

const labelClass =
  "nn-label text-[0.52rem] tracking-[0.2em] text-[var(--si-muted)] mb-2.5 block";

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
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div>
          <div className="mb-10 sm:mb-12">
            <p className="nn-label text-[0.48rem] text-[var(--si-muted)] mb-3">
              Details
            </p>
            <h2 className="nn-display text-2xl sm:text-3xl font-light text-[var(--si-deep-brown)] leading-tight">
              Edit your{" "}
              <span className="nn-display-italic text-[var(--si-burnt-orange)]">
                profile
              </span>
            </h2>
          </div>

          <Form {...form}>
            <form
              className="grid md:grid-cols-2 grid-cols-1 gap-6 max-w-2xl"
              onSubmit={form.handleSubmit(updateProfile)}
            >
              <div className="md:col-span-2 flex justify-start">
                <Dropzone
                  onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="cursor-pointer group">
                      <input {...getInputProps()} />
                      <div className="relative">
                        <Avatar className="w-24 h-24 rounded-none border border-[var(--si-mist)]">
                          <AvatarImage
                            src={preview ? preview : userIcon.src}
                            className="object-cover"
                          />
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--si-deep-brown)]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaCamera className="text-[var(--si-cream)]" size={16} />
                        </div>
                      </div>
                      <p className="nn-label mt-3 text-[0.48rem] text-[var(--si-muted)] group-hover:text-[var(--si-deep-brown)] transition-colors">
                        Change Portrait
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
                          className={`${inputClass} min-h-[7rem] py-3 resize-y`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Save Changes"
                  className="nn-btn-primary !rounded-none cursor-pointer !py-3 px-8"
                />
              </div>
            </form>
          </Form>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default Profile;
