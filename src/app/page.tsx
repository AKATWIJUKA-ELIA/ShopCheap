"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "./DataContext";
import Loader from "@/components/Loader/loader";
import FisrtHero from "@/components/FirstHero/page";
import SecondHero from "@/components/SecondHero/page";
import Main from "@/components/Main/main";
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";
import {store,persistor} from "@/store/store"
import MainHero from "@/components/MainHero/page";
import TopRatings from "@/components/TopRatings/main";


export default function Page() {
  const router = useRouter();
  const {data} = useData();
//    const { sponsored: sponsored } = useGetSponsored();
const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.Products.product.length > 0) {
        setLoading(false);
    }
  }, [data, router]);

  if (loading) {
        return <div className="absolute inset-0 bg-transparent bg-opacity-15 backdrop-blur-lg">
                 <Loader />
        </div>;
  }
  return (
    <div className="relative flex  items-center justify-center bg-white min-h-screen"
//     style={{ backgroundImage: `url("images/wallp.jpg")`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center' }}
    >
         <div className="backdrop-blur-md md:px-1 lg:px-12 ">
                <Provider store={store}>
                <PersistGate persistor={persistor}>
                        <MainHero />
                        {/* <SecondHero /> */}
                        <FisrtHero />
                        <TopRatings />
                        <Main />
                </PersistGate>
 </Provider>
        </div>
      
    </div>
  );
}
