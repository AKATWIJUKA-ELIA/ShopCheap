import React, { useState }  from 'react';
import Link from "next/link";
import { IoBagCheckOutline  } from "react-icons/io5";
import {UserCircleIcon,Bookmark,LogOut, Loader2 } from "lucide-react"
import {type LucideIcon } from "lucide-react"
import useLogout from '@/hooks/useLogout';
interface UserDropDownMenuProps {
  isvisible: boolean;
  onClose: () => void;
}
const items =[
      
        {
                item:"account",
                link:"/profile",
                icon: UserCircleIcon as LucideIcon,
        },
        {
                item:"bookmarks",
                link:"/profile/bookmarks",
                icon: Bookmark as LucideIcon,
        },
        {
                item:"orders",
                link:"/profile/orders",
                icon: IoBagCheckOutline as LucideIcon,

        },

]

const UserDropDownMenu: React.FC<UserDropDownMenuProps> = ({ isvisible, onClose,  }) => {
          const logout = useLogout();
          const [logoutLoading, setLogoutLoading] = useState(false);
          const handleLogout = async () => {
                setLogoutLoading(true);
                logout();
                setLogoutLoading(false);
          }

      if (!isvisible) return null;

      if (logoutLoading) return <div className='flex justify-center items-center h-full'>
        <Loader2 className='w-4 h-4 animate-spin' />
      </div>

  return (
  <div className="  fade-in  fixed !z-[99990] md:top-14 md:right-40 rounded-lg   shadow-xl shadow-black/80  flex  w-[10%] h-auto  overflow-auto overflow-x-hidden bg-white dark:bg-dark " id="wrapper" onMouseLeave={onClose} >
        <div className="  cursor-pointer  w-full py-2" onClick={onClose} >
                {items.map((item,index) =>(
                <Link key={index} href={`${item.link}`}  className='flex hover:bg-gray-400 p-2 gap-3  dark:hover:bg-gray-800'>
                 {item.icon &&  <item.icon className='w-5' />  }       
                <h1   className='animated  main font-semibold '  > <span id='main' className='animated current   '>{item.item}</span></h1> 
                </Link>
                ))
                }
                <div className='flex gap-4 hover:bg-red-400 p-2 ' onClick={()=>handleLogout()} >
                        <LogOut className='w-4' /> <h1 className='font-semibold ' >Log out</h1>
                </div>
        </div>
</div>
  );
};

export default UserDropDownMenu;