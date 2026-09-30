import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import idealLogo from '@/public/assets/images/logo-icon.png'
import { useSelector } from "react-redux"

import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { ADMIN_ORDER_SHOW, ADMIN_PRODUCT_ADD } from "@/routes/AdminPanelRoute";

const UserDropdown = () => {
    const auth = useSelector((store) => store.authStore.auth)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Account menu"
                >
                    <Avatar className="size-9 bg-white">
                        <AvatarImage
                            src={idealLogo.src}
                            alt="Super Ideal"
                            className="object-contain p-0.5"
                        />
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="me-5 w-44">
                <DropdownMenuLabel>
                    <p className="font-semibold">{auth?.name}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={ADMIN_PRODUCT_ADD} className="cursor-pointer">
                        <IoShirtOutline />
                        New Product
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={ADMIN_ORDER_SHOW} className="cursor-pointer">
                        <MdOutlineShoppingBag />
                        Orders
                    </Link>
                </DropdownMenuItem>

                <LogoutButton />

            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default UserDropdown