"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "./DataContext";
import Loader from "@/components/Loader/loader";
// import useGetSponsored from '@/hooks/useGetSponsored';


export default function Page() {
  const router = useRouter();
  const {data} = useData();
//    const { sponsored: sponsored } = useGetSponsored();
const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.Products.product.length > 0) {
        setLoading(false);
        router.push("/home");
    }
  }, [data, router]);

  // Show loading state while redirecting
  return (
    <div className="relative flex  items-center justify-center bg-white min-h-screen"
//     style={{ backgroundImage: `url("images/wallp.jpg")`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center' }}
    >
        <div className="absolute inset-0 bg-transparent bg-opacity-15 backdrop-blur-lg">
                {loading && <Loader />}
        </div>
      
    </div>
  );
}
