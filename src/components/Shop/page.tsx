"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Star,
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  Share2,
  BadgeCheck,
  X,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import HeroCard from "../HeroCards/page"
import { Product, User } from "@/lib/types"
import { ShopData,Review } from "@/lib/types"
import useGetProductsByOwnerApproved from "@/hooks/useGetProductsByOwnerApproved"
import {getReviewsByProduct} from "@/lib/convex"
import Image from "next/image"
import Link from "next/link"
import { getUserById } from "@/lib/convex"
import { Id } from "../../../convex/_generated/dataModel"
import useRetrieveLocation from "@/hooks/useRetrieveLocation"
import useGetCategories from "@/hooks/useGetCategories"
import Loader from "../Loader/loader"

interface ProductWithReviews extends Product {
  reviews: Review[];
}       
interface ShopProps {
        shop: ShopData;
}


const Shop:React.FC<ShopProps> = ({shop} ) =>{
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const { data: SameSellerProducts } = useGetProductsByOwnerApproved(shop?.owner_id ?? "");
      const [productsWithReviews, setProductsWithReviews] = useState<ProductWithReviews[]>([]);
      const [Seller, setSeller] = useState<User | null>(null);
      const { data: categories } = useGetCategories();
        const { retrievedLocation } = useRetrieveLocation(
          shop.location?.lat ?? 0,
          shop.location?.lng ?? 0
        );
        // console.log("Shop Location:", shop.location);      
  
    
    useEffect(() => {
        const fetchReviews = async () => {
            if (!SameSellerProducts?.length) return;
            setViewMode("grid");
            const enhanced = await Promise.all(
                SameSellerProducts.map(async (product) => {
                    const reviewData = await getReviewsByProduct(product._id);
                    return {
                        ...product,
                        reviews: reviewData.data || []
                    };
                })
            );
            
            setProductsWithReviews(enhanced);
        };
        
        fetchReviews();
    }, [SameSellerProducts]);

  useEffect(() => {
        const fetchSeller = async () => {
                if (!shop?.owner_id) return;
                const response = await getUserById(shop.owner_id as Id<"customers">);
                if (response.user) {
                        setSeller(response.user || null);       
                }
        }
        fetchSeller();
  }, [shop?.owner_id]);
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = productsWithReviews?.filter((product) => {
      const matchesSearch =
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || product.product_cartegory === selectedCategory

      return matchesSearch && matchesCategory
    })



    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered?.sort((a, b) => Number(a.product_price) - Number(b.product_price))
        break
      case "price-high":
        filtered?.sort((a, b) => Number(b.product_price) - Number(a.product_price))
        break
      default:
      
    }

    return filtered
  }, [productsWithReviews,searchQuery, selectedCategory, sortBy])


  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
                <Link href={`/product/${product._id}`}>
                 <Image
                 fill
              src={product.product_image[0] || "/placeholder.svg"}
              alt={product.product_name}
              className="w-24 h-24 object-cover rounded-lg"
            />
                </Link>
            {/* {product.discount && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs">
                -{product.discount}%
              </Badge>
            )} */}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors cursor-pointer">
                {product.product_name}
              </h3>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{product.product_description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.product_likes||0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                {/* <span className="text-sm text-gray-600">({product.reviewCount})</span> */}
              </div>

              <Badge variant="outline">{product.product_cartegory}</Badge>

              {/* {product.isNew && <Badge className="bg-green-500">New</Badge>} */}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">Ugx: {product.product_price}</span>
                {/* {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )} */}
              </div>

              <Button className="bg-gold" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
      const allRatings = filteredProducts
  .flatMap(product => product.reviews.map(review => review.rating));

const averageRating = allRatings.length > 0
  ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
  : 0;

  const productLikes = filteredProducts.reduce((acc, product) => acc + (product.product_likes || 0), 0);

  if(!shop )
        return <div className="min-h-screen flex items-center justify-center">
                <Loader />
        </div>
  return (
    <div className="min-h-screen md:px-4 bg-gray-50 dark:bg-gray-900">
      {/* Shop Header */}

      <Card className="mt-20 " >
        <CardContent className="p-0">
          {/* Banner */}
          <div className="relative h-44 md:h-60  w-full border-2 border-b-gold overflow-hidden rounded-t-xl bg-gradient-to-r from-primary to-accent">
            {shop.cover_image && (
                <Image src={shop.cover_image || "/placeholder.svg?height=300&width=1200&text=Shop+Cover"}  fill alt={shop.shop_name} priority/>
            )}
          </div>

          {/* Shop Info */}
          <div className="relative px-6 pb-6">
            {/* Logo */}
            <div className="relative -mt-12 mb-4 flex items-end gap-4">
                          <div className="flex flex-col md:flex-row  gap-2 md:space-x-4" >
                        <Avatar className=" flex h-24 w-24 border-4  border-white shadow-lg">
                <AvatarImage src={shop.profile_image || "/placeholder.svg"} alt={shop.shop_name} />
                <AvatarFallback className="text-2xl font-bold">
                  {shop.shop_name
                  .toUpperCase()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

                 </div>
              <div className="mb-2 flex gap-3">
                {/* Add category */}
                {/* <Badge variant="secondary">{shop.category}</Badge> */} 
                 {shop.isOpen?(<Badge  variant="secondary" className="text-xs flex bg-green-200 border border-green-600 ">
                                Open
                          </Badge>):(
                                <Badge  variant="destructive" className="text-xs">
                            <X className="h-3 w-3 mr-1" />
                                Closed
                          </Badge>
                          )}

                          {shop?.is_verified ? (<Badge  variant="outline" className="flex text-xs bg-gray-200  border border-gold ">
                                Verified seller
                                <BadgeCheck fill="gold" className="h-5 w-5  ml-2 border  " />
                          </Badge>):(
                                <div>

                                </div>
                          )}
              </div>
            </div>

            {/* Shop Details */}
            <div className="space-y-4 px-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">{shop.shop_name}</h1>
                <p className="text-gold dark:text-gray-400">{shop.slogan}</p>
              </div>
              <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{averageRating.toFixed(2)} average Rating</span>
                      </div>

              <p className="text-sm leading-relaxed">{shop.description}</p>

              {/* Contact Info Grid */}
              <div className="grid gap-3 pt-4 border-t">
                {Seller?.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{Seller.email}</span>
                  </div>
                )}
                {Seller?.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a 
                        href={`tel:${Seller.phoneNumber}`} 
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                        {Seller.phoneNumber}
                        </a>

                  </div>
                )}
                {shop.location && (
                   <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{retrievedLocation.map((loc)=>{
                                return `${loc.address.label},${loc.resultType}`
                        })}</span>
                      </div>
                )}
                {/* {data.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={data.website}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.website}
                    </a>
                  </div>
                )} */}
                {/* Shop Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{productsWithReviews?.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{productLikes} </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="">
                      
                        <span className="md:text-2xl font-bold text-red-600 dark:text-white">{new Date(shop._creationTime).toLocaleDateString()}</span>
                       <h1 className=" text-sm text-gray-600 dark:text-gray-400" > Joined</h1>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{(new Date().getFullYear() - new Date(shop._creationTime).getFullYear())>0?(<div>{new Date().getFullYear() - new Date(shop._creationTime).getFullYear()} yrs Experience</div>):""} </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Policies */}
      {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <Truck className="h-8 w-8 text-blue-600" />
            <div>
              <div className="font-medium">Shipping</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{mockSeller.policies.shipping}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <RotateCcw className="h-8 w-8 text-green-600" />
            <div>
              <div className="font-medium">Returns</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{mockSeller.policies.returns}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <div>
              <div className="font-medium">Warranty</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{mockSeller.policies.warranty}</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value="All">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category.cartegory}>
                          {category.cartegory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {productsWithReviews?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts?.map((product) =>
                  viewMode === "grid" ? (
                    <HeroCard key={product._id} product={product} />
                  ) : (
                    <ProductListItem key={product._id} product={product} />
                  ),
                )}
              </div>
            )}
          </Card>
      </div>
    </div>
  )
}
export default Shop