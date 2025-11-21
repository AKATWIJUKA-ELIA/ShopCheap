import { NextResponse,NextRequest } from 'next/server';
import {getCache,setCache} from '@/lib/redis';
import {getProductById} from "@/lib/convex";

export async function POST( request: NextRequest) {
        const body =  await request.json();
        const {product,id} = body;
        const newKey = id ? `${product}:${id}` : product;
          const CachedProducts = async () => {
          const data = await getCache(newKey);
          return data;
  };
        const data = await CachedProducts();
        // console.log("Returned Data:", data);
        if(data.status === 404){
                await getProductById(id).then(async (res) => {
                        if(res.success && res.product){
                                const newProduct = res.product;
                                await setCache(newKey, JSON.stringify(newProduct), 3600);
                                return NextResponse.json({ value:[newProduct] });
                        }
                });
        }
  return NextResponse.json({ value:data.data });
}