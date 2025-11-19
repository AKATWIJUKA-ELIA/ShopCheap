import { NextResponse,NextRequest } from 'next/server';
import {getCache} from '@/lib/redis'; 

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
  return NextResponse.json({ value:data });
}