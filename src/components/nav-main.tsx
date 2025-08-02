"use client"

import {type LucideIcon } from "lucide-react"
import { IoAddCircle,IoBagCheckOutline  } from "react-icons/io5";
import {LayoutDashboardIcon,UserCircleIcon,Bookmark,CreditCard, } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { useAppSelector } from "@/hooks";

export function NavMain() {
        const user = useAppSelector((state)=>state.user.user)
        
        const items = [
                {
                        title: "My ShopCheap",
                        icon: UserCircleIcon  as LucideIcon,
                        link:"/profile/",
                },
              
                {
                        title: "Orders",
                        icon: IoBagCheckOutline as LucideIcon,
                        link:"/profile/orders",
                },
                 
                {
                        title: "Bookmarks",
                        icon: Bookmark  as LucideIcon,
                        link:"/profile/bookmarks",
                },
                {
                        title: "payments",
                        icon: CreditCard  as LucideIcon,
                        link:"/profile/payments",
                },

        ]
        if(user?.role === "seller"){
                        items.push(
                                {
                        title: "Sellers DashBoard",
                        icon: LayoutDashboardIcon  as LucideIcon,
                        link:"/admin",
                },
                        )
                }

                if(user?.role === "admin"){
                        items.push(
                                {
                        title: "Sudo DashBoard",
                        icon: LayoutDashboardIcon  as LucideIcon,
                        link:"/sudo",
                },
                {
                        title: "Sellers DashBoard",
                        icon: LayoutDashboardIcon  as LucideIcon,
                        link:"/admin",
                },
                        )
                }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2 mt-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Dashboard"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <LayoutDashboardIcon />
              <span>Dashboard</span>
            </SidebarMenuButton>
          
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="font-semibold">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="flex items-center gap-2">
              <Link href={item.link} className="w-full">
                <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
