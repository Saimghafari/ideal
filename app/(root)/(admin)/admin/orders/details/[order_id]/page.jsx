"use client";
import Image from "next/image";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import useFetch from "@/hooks/useFetch";
import { use, useEffect, useState } from "react";
import useVisiblePoll from "@/hooks/useVisiblePoll";
import { ADMIN_DASHBOARD, ADMIN_ORDER_SHOW } from "@/routes/AdminPanelRoute";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import Select from "@/components/Application/Select";
import { orderStatusOptions } from "@/lib/utils";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { formatMoney } from "@/lib/formatCurrency";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_ORDER_SHOW, label: "Orders" },
  { href: "", label: "Order Details" },
];

const statusOptions = orderStatusOptions;

const OrderDetails = ({ params }) => {
  const { order_id } = use(params);
  const [orderData, setOrderData] = useState();
  const [orderStatus, setOrderStatus] = useState();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { data, loading, refetch } = useFetch(`/api/orders/get/${order_id}`);
  const orderCurrency = "PKR";

  useEffect(() => {
    if (data && data.success) {
      setOrderData(data.data);
      setOrderStatus(data?.data?.status);
    }
  }, [data]);

  useVisiblePoll(refetch, 5000, false);

  const handleOrderStatus = async () => {
    setUpdatingStatus(true);
    try {
      const { data: response } = await axios.put("/api/orders/update-status", {
        _id: orderData?._id,
        status: orderStatus,
      });
      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <div className="border">
        {!orderData ? (
          <div className="flex justify-center items-center py-32">
            <h4 className="text-red-500 text-xl font-semibold">
              Order Not Found
            </h4>
          </div>
        ) : (
          <div>
            <div className="py-2 px-5 border-b mb-3">
              <h4 className="text-lg font-bold text-primary">Order Details</h4>
            </div>

            <div className="px-5 mb-5">
              <div className="mb-5">
                <p>
                  <b>Order Id:</b> {orderData?.order_id}
                </p>
                <p>
                  <b>Payment Method:</b>{" "}
                  {orderData?.payment_method === "COD"
                    ? "Cash on Delivery"
                    : orderData?.payment_method === "Invoice"
                      ? "Bank Transfer"
                      : orderData?.payment_method || "Bank Transfer"}
                </p>
                <p className="capitalize">
                  <b>Kitchen:</b>{" "}
                  {String(orderData?.fulfillmentStage || orderData?.status || "").replaceAll("_", " ")}
                  {orderData?.prepMinutes ? ` · ${orderData.prepMinutes} min` : ""}
                </p>
                <p>
                  <b>Branch:</b> {orderData?.branchName || "—"}
                </p>
                <p className="capitalize">
                  <b>Service:</b> {orderData?.serviceType === "pickup" ? "Pickup" : "Delivery"}
                </p>
              </div>
              <table className="w-full border">
                <thead className="border-b bg-gray-50 dark:bg-card md:table-header-group hidden">
                  <tr>
                    <th className="text-start p-3">Product</th>
                    <th className="text-center p-3">Price</th>
                    <th className="text-center p-3">Quantity</th>
                    <th className="text-center p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData &&
                    orderData?.products?.map((product, index) => {
                      const lineKey =
                        product?.variantId?._id ||
                        product?.productId?._id ||
                        product?._id ||
                        `line-${index}`;
                      const imageSrc =
                        product?.variantId?.media?.[0]?.secure_url ||
                        product?.productId?.media?.[0]?.secure_url ||
                        placeholderImg.src;

                      return (
                      <tr
                        key={lineKey}
                        className="md:table-row block border-b"
                      >
                        <td className="md:table-cell p-3">
                          <div className="flex items-center gap-5">
                            <Image
                              src={imageSrc}
                              width={60}
                              height={60}
                              alt="product"
                              className="rounded"
                            />
                            <div>
                              <h4 className="text-lg">
                                <Link
                                  href={WEBSITE_PRODUCT_DETAILS(
                                    product?.productId?.slug
                                  )}
                                >
                                  {product?.productId?.name || product?.name}
                                </Link>
                                {product?.variantId?.color && (
                                  <p>Color: {product.variantId.color}</p>
                                )}
                                <p>
                                  Size:{" "}
                                  {product?.size ||
                                    product?.variantId?.size ||
                                    "—"}
                                </p>
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                          <span className="md:hidden font-medium">Price</span>
                          <span>
                            {formatMoney(product.sellingPrice, orderCurrency)}
                          </span>
                        </td>
                        <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                          <span className="md:hidden font-medium">
                            Quantity
                          </span>
                          <span>{product.qty}</span>
                        </td>
                        <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                          <span className="md:hidden font-medium">Total</span>
                          <span>
                            {formatMoney(
                              product.qty * product.sellingPrice,
                              orderCurrency
                            )}
                          </span>
                        </td>
                      </tr>
                    )})}
                </tbody>
              </table>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-10 border mt-10">
                <div className="p-5">
                  <h4 className="text-lg font-semibold mb-5">
                    Shipping Address
                  </h4>
                  <div>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-medium py-2">Name</td>
                          <td className="text-end py-2">{orderData?.name}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Email</td>
                          <td className="text-end py-2">{orderData?.email}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Phone</td>
                          <td className="text-end py-2">{orderData?.phone}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Country</td>
                          <td className="text-end py-2">
                            {orderData?.country}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">State</td>
                          <td className="text-end py-2">{orderData?.state}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">City</td>
                          <td className="text-end py-2">{orderData?.city}</td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Pincode</td>
                          <td className="text-end py-2">
                            {orderData?.pincode}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Landmark</td>
                          <td className="text-end py-2">
                            {orderData?.landmark}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Order note</td>
                          <td className="text-end py-2">
                            {orderData?.ordernote || "---"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-card">
                  <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                  <div>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-medium py-2">Subtotal</td>
                          <td className="text-end py-2">
                            {formatMoney(orderData?.subtotal, orderCurrency)}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Discount</td>
                          <td className="text-end py-2">
                            {formatMoney(orderData?.discount, orderCurrency)}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Coupon Discount</td>
                          <td className="text-end py-2">
                            {formatMoney(
                              orderData?.couponDiscountAmount,
                              orderCurrency
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-medium py-2">Total</td>
                          <td className="text-end py-2">
                            {formatMoney(orderData?.totalAmount, orderCurrency)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <hr />

                  <div className="pt-3">
                    <h4 className="text-lg font-semibold mb-2">Order Status</h4>
                    <Select
                      options={statusOptions}
                      selected={orderStatus}
                      setSelected={(value) => setOrderStatus(value)}
                      placeholder="Select"
                      isMulti={false}
                    />
                    <ButtonLoading
                      type="button"
                      loading={updatingStatus}
                      onClick={handleOrderStatus}
                      text="Save Status"
                      className="mt-5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
