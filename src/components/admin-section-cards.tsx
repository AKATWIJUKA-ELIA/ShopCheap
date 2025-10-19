import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "../components/ui/badge"
// import { useUser } from "@clerk/nextjs"
import '../app/globals.css'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useGetAllProducts from "@/hooks/useGetAllProducts"
import { useEffect, useState } from "react"
interface Product {
        _id:string,
  approved: boolean,
  product_cartegory: string,
  product_condition: "new"|"used"| "refurbished",
  product_description: string,
  product_image: string|null,
  product_name: string,
  product_owner_id: string,
  product_price: string,
        product_discount?: number,
  _creationTime:number
      }
      type products = Product[]

interface SectionProps {
  ClickedCard: (value:string) => void
}

const  SectionCards: React.FC<SectionProps>=({ClickedCard})=> {
        const { data: Allproducts, } = useGetAllProducts()
                const [ApprovedProducts, setApprovedProducts] = useState<products>([])
                const [PendingProducts, setPendingProducts] = useState<products>([])
                useEffect(()=>{
                        const HanldeFilter=()=>{
                                const filteredapproved = [] as products
                                const filteredpending = [] as products
                                Allproducts?.map((product)=>product.approved
                                ?filteredapproved.push(product):filteredpending.push(product) )
                                setApprovedProducts(filteredapproved)
                                setPendingProducts(filteredpending)
                                // console.log("Approved Products:",filteredpending)
                        }
                        HanldeFilter()
                },[Allproducts])
        // const {data:products}  = useGetProductsByOwner(user.user?.id||"") 
  return (
    <div className=" *:data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      
      <Card onClick={()=>ClickedCard("")}  className="@container/card bg-blue-100 transition-transform duration-200 hover:border-pink-400 hover:cursor-pointer hover:scale-105 dark:text-black ">
        <CardHeader className="relative">
          <CardDescription>All Products</CardDescription>
          <CardTitle  className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {Allproducts?.length} Products
          </CardTitle>
          <div className="absolute right-4 top-4 ">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs dark:text-black">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card onClick={()=>ClickedCard("approved")}  className="@container/card bg-pink-100 transition-transform duration-200 hover:border-blue-400 hover:cursor-pointer hover:scale-105 dark:text-black ">
        <CardHeader className="relative">
          <CardDescription>Approved Products</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {ApprovedProducts?.length} Products
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs dark:text-black">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      <Card onClick={()=>ClickedCard("pending")} className="@container/card bg-blue-100 transition-transform duration-200 hover:border-pink-400 hover:cursor-pointer hover:scale-105 dark:text-black ">
        <CardHeader className="relative">
          <CardDescription>Pending Products</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {PendingProducts?.length} Products
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs dark:text-black">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>

      <Card onClick={()=>ClickedCard("users")} className="@container/card bg-pink-100 transition-transform duration-200 hover:border-blue-400 hover:cursor-pointer hover:scale-105 dark:text-black ">
        <CardHeader className="relative">
          <CardDescription>Active Accounts / Users</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            45,678
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs dark:text-black">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-blue-100 transition-transform duration-200 hover:border-pink-400 hover:cursor-pointer hover:scale-105 dark:text-black ">
        <CardHeader className="relative">
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs  dark:text-black">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>

    </div>
  )
}
export default SectionCards