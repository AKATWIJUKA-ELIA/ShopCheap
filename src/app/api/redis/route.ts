import { NextResponse,NextRequest } from 'next/server';
import {setCache} from '@/lib/redis'; 

export async function POST( request: NextRequest) {
        const body =  await request.json();
        const {products, key} = body;
        // console.log('Received key for caching:',key);
        // console.log('Received products for caching:',products);


          const CachedProducts = async () => {
          const data = await setCache(key, JSON.stringify(products), 3600);
          return data;
  };
        const data = await CachedProducts();

  return NextResponse.json({ value:data });
}