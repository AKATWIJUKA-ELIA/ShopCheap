"use client"
import FisrtHero from "@/components/FirstHero/page";
// import SecondHero from "@/components/SecondHero/page";
import Main from "@/components/Main/main";
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";
import {store,persistor} from "@/store/store"
import { useRouter } from "next/navigation";
import { useData } from "../DataContext";
import MainHero from "@/components/MainHero/page";
import TopRatings from "@/components/TopRatings/main";
import { useEffect } from "react";

export default function Home() {
        const router = useRouter();
          const {data} = useData();
          
          useEffect(() => {
            if (!data|| data.Products.product.length === 0 || data.Categories.categories.length === 0) {
              router.push("/"); 
            }
            
          }, [data, router]);
  return (
        <div className="backdrop-blur-md px-24"
        // style={{ backgroundImage: `url("images/wallp.jpg")`,
        //                 backgroundSize: 'cover',
        //                 backgroundPosition: 'center' }}
        >
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
  );
}
