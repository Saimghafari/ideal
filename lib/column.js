import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import userIcon from "@/public/assets/images/user.png";
export const DT_BRANCH_COLUMN = [
  {
    accessorKey: "name",
    header: "Branch",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "hours",
    header: "Hours",
  },
  {
    accessorKey: "prepMinutes",
    header: "Prep time",
    Cell: ({ renderedCellValue }) => <span>{renderedCellValue || 20} min</span>,
  },
];

export const DT_CATEGORY_COLUMN = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
];

export const DT_PRODUCT_COLUMN = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "mrpPkr",
    header: "MRP (PKR)",
    Cell: ({ row }) => <span>{row.original.mrpPkr || row.original.mrp || 0}</span>,
  },
  {
    accessorKey: "sellingPricePkr",
    header: "Selling Price (PKR)",
    Cell: ({ row }) => <span>{row.original.sellingPricePkr || row.original.sellingPrice || 0}</span>,
  },
  {
    accessorKey: "discountPercentagePkr",
    header: "Discount % (PKR)",
    Cell: ({ row }) => <span>{row.original.discountPercentagePkr || row.original.discountPercentage || 0}</span>,
  },
];

export const DT_PRODUCT_VARIANT_COLUMN = [
  {
    accessorKey: "product",
    header: "Product Name",
  },
  {
    accessorKey: "size",
    header: "Wall Size",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },

  {
    accessorKey: "mrpPkr",
    header: "MRP (PKR)",
    Cell: ({ row }) => <span>{row.original.mrpPkr || row.original.mrp || 0}</span>,
  },
  {
    accessorKey: "sellingPricePkr",
    header: "Selling Price (PKR)",
    Cell: ({ row }) => <span>{row.original.sellingPricePkr || row.original.sellingPrice || 0}</span>,
  },
  {
    accessorKey: "discountPercentagePkr",
    header: "Discount % (PKR)",
    Cell: ({ row }) => <span>{row.original.discountPercentagePkr || row.original.discountPercentage || 0}</span>,
  },
];

export const DT_COUPON_COLUMN = [
  {
    accessorKey: "code",
    header: "Code",
  },

  {
    accessorKey: "discountPercentage",
    header: "Discount Percentage",
  },

  {
    accessorKey: "minShoppingAmount",
    header: "Min. Shopping Amount",
  },
  {
    accessorKey: "validity",
    header: "Validity",
    Cell: ({ renderedCellValue }) =>
      new Date() > new Date(renderedCellValue) ? (
        <Chip
          color="error"
          label={dayjs(renderedCellValue).format("DD/MM/YYYY")}
        />
      ) : (
        <Chip
          color="success"
          label={dayjs(renderedCellValue).format("DD/MM/YYYY")}
        />
      ),
  },
];

export const DT_CUSTOMERS_COLUMN = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    Cell: ({ renderedCellValue }) => (
      <Avatar>
        <AvatarImage src={renderedCellValue?.url || userIcon.src} />
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isEmailVerified",
    header: "Is Verified",
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not Verified" />
      ),
  },
];

export const DT_REVIEW_COLUMN = [
  {
    accessorKey: "product",
    header: "Product",
  },

  {
    accessorKey: "user",
    header: "User",
  },

  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
];

export const DT_ORDER_COLUMN = [
  {
    accessorKey: "order_id",
    header: "Order Id",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    Cell: ({ renderedCellValue }) => new Date(renderedCellValue).toDateString(),
  },
  {
    accessorKey: "payment_id",
    header: "Payment Id",
  },

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "city",
    header: "City",
  },

  {
    accessorKey: "pincode",
    header: "Pincode",
  },
  {
    accessorKey: "totalItem",
    header: "Total Item",
    Cell: ({ renderedCellValue, row }) => (
      <span>{row?.original?.products?.length || 0}</span>
    ),
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
  },
  {
    accessorKey: "discount",
    header: "Discount",
    Cell: ({ renderedCellValue }) => (
      <span>{Math.round(renderedCellValue)}</span>
    ),
  },
  {
    accessorKey: "couponDiscount",
    header: "Coupon Discount",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "fulfillmentStage",
    header: "Kitchen",
    Cell: ({ renderedCellValue }) => (
      <span className="capitalize">
        {String(renderedCellValue || "received").replaceAll("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "branchName",
    header: "Branch",
  },
];
