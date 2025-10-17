"use client"
import React, { useEffect, useState }  from 'react'
import { usePathname } from 'next/navigation';
import { Footer } from '../Footer/page';
import { useData } from "../../app/DataContext";

const ConditionalFooter = () => {
         const {data} = useData();
         const [showfooter, setshowfooter] = useState(false)

           useEffect(() => {
    if (data && data.Products.product.length >0 ) {
        setTimeout(()=>{
                setshowfooter(true)
        },5000)
//       setshowfooter(true)
        }
  }, [data]);
        const pathname = usePathname()
        if(pathname.includes("profile") || pathname.includes("admin")|| pathname.includes("sudo")){
                        return null
                }
  return (
        <div>
                {showfooter && <Footer/>}
        </div>
    
  )
}

export default ConditionalFooter