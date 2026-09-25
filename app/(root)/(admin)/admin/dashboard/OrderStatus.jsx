"use client"

import { Label, Pie, PieChart } from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import useFetch from "@/hooks/useFetch"

const chartConfig = {
    status: {
        label: "Status",
    },
    unpaid: {
        label: "Unpaid",
        color: "#f59e0b",
    },
    paid: {
        label: "Paid",
        color: "#16a34a",
    },
    pending: {
        label: "Pending",
        color: "#3b82f6",
    },
    processing: {
        label: "Processing",
        color: "#eab308",
    },
    shipped: {
        label: "Shipped",
        color: "#06b6d4",
    },
    delivered: {
        label: "Delivered",
        color: "#22c55e",
    },
    cancelled: {
        label: "Cancelled",
        color: "#ef4444",
    },
    unverified: {
        label: "Unverified",
        color: "#f97316",
    },
}

const STATUS_ROWS = [
    { key: "unpaid", label: "Unpaid", className: "bg-amber-500" },
    { key: "paid", label: "Paid", className: "bg-green-600" },
    { key: "processing", label: "Processing", className: "bg-yellow-500" },
    { key: "shipped", label: "Shipped", className: "bg-cyan-500" },
    { key: "delivered", label: "Delivered", className: "bg-green-500" },
    { key: "cancelled", label: "Cancelled", className: "bg-red-500" },
]

export function OrderStatus() {
    const [chartData, setChartData] = useState([])
    const [statusCount, setStatusCount] = useState()
    const [totalCount, setTotalCount] = useState(0)
    const { data: orderStatus, loading } = useFetch('/api/dashboard/admin/order-status')

    useEffect(() => {
        if (orderStatus && orderStatus.success) {
            const newOrderStatus = orderStatus.data.map((o) => ({
                status: o._id,
                count: o.count,
                fill: `var(--color-${o._id})`
            }))

            setChartData(newOrderStatus)

            const getTotalCount = orderStatus.data.reduce((acc, curr) => acc + curr.count, 0)
            setTotalCount(getTotalCount)

            const statusObj = orderStatus.data.reduce((acc, item) => {
                acc[item._id] = item.count
                return acc;
            }, {})

            setStatusCount(statusObj)
        }
    }, [orderStatus])

    return (
        <div>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {totalCount}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Orders
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>

            <div>
                <ul>
                    {STATUS_ROWS.map((row) => (
                        <li key={row.key} className="flex justify-between items-center mb-3 text-sm">
                            <span>{row.label}</span>
                            <span className={`px-2 text-sm text-white ${row.className}`}>
                                {statusCount?.[row.key] || 0}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
