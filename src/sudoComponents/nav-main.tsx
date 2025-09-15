"use client"

import {Rocket, type LucideIcon } from "lucide-react"
import {LayoutDashboardIcon,
        HomeIcon,
        CreditCard,
        SquarePlus,
        Rows4,
        Newspaper,
        Users,
        FileUser
        // HandCoins,SquareStack,User

} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { MdOutlinePending } from "react-icons/md";
import { FcApproval } from "react-icons/fc";

export function NavMain() {
        const items = [
                {
                        title: "Home",
                        icon: HomeIcon as LucideIcon,
                        link:"/sudo",
                },
             
                 {
                        title: "Add products",
                        icon: SquarePlus   as LucideIcon,
                        link:"/sudo/post",
                },
                {
                        title: "All products",
                        icon: Rows4    as LucideIcon,
                        link:"/sudo/#all",
                },
                {
                        title: "Approved Products",
                        icon: FcApproval    as LucideIcon,
                        link:"/sudo/approved",
                },
                
                {
                        title: "Pending",
                        icon: MdOutlinePending     as LucideIcon,
                        link:"/sudo/pending",
                },
                {
                        title: "Customers",
                        icon: Users     as LucideIcon,
                        link:"/sudo/customers",
                },
                 {
                        title: "Seller-Applications",
                        icon: FileUser     as LucideIcon,
                        link:"/sudo/seller-applications",
                },
                {
                        title: "Transactions",
                        icon: CreditCard   as LucideIcon,
                        link:"/sudo/transactions",
                },
                
                {
                        title: "Boosts ",
                        icon: Rocket   as LucideIcon,
                        link:"/sudo/boost",
                },
                {
                        title: "NewsLetter",
                        icon: Newspaper      as LucideIcon,
                        link:"/sudo/newsletter",
                },

               
                
                
        ]
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
        <SidebarMenu className="font-semibold gap-4">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="flex items-center gap-2">
              <Link href={item.link} className="w-full ">
                <SidebarMenuButton tooltip={item.title} className="gap-3" >
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
