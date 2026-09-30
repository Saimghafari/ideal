import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode || (success ? 200 : 500) }
  );
};

export const catchError = (error, customMessage) => {
  // handling duplicate key error
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(",");
    error.message = `Duplicate fields: ${keys}. These fields value must be unique.`;
  }

  let errorObj = {};

  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "Internal server error.",
    };
  }

  const status =
    typeof error.statusCode === "number"
      ? error.statusCode
      : typeof error.status === "number"
        ? error.status
        : 500;

  return NextResponse.json(
    {
      success: false,
      statusCode: status,
      ...errorObj,
    },
    { status }
  );
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const columnConfig = (
  column,
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
) => {
  const newColumn = [...column];

  if (isCreatedAt) {
    newColumn.push({
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }
  if (isUpdatedAt) {
    newColumn.push({
      accessorKey: "updatedAt",
      header: "Updated At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }
  if (isDeletedAt) {
    newColumn.push({
      accessorKey: "deletedAt",
      header: "Deleted At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }

  return newColumn;
};

export const statusBadge = (status) => {
  const statusColorConfig = {
    unpaid: "bg-amber-500",
    paid: "bg-green-600",
    pending: "bg-blue-500",
    processing: "bg-yellow-500",
    shipped: "bg-cyan-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    unverified: "bg-orange-500",
    received: "bg-amber-500",
    preparing: "bg-yellow-500",
    on_the_way: "bg-cyan-500",
  };
  const label = String(status || "").replaceAll("_", " ");
  return (
    <span
      className={`${statusColorConfig[status] || "bg-gray-500"} text-white capitalize px-3 py-1 text-xs`}
      style={{ borderRadius: 0 }}
    >
      {label}
    </span>
  );
};
