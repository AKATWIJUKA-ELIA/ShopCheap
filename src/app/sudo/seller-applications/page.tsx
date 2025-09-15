"use client"

import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbListDetails } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { getUserById } from "@/lib/convex"
import {
  Clock,
  Package,
  CheckCircle,
  Search,
  Calendar,
  Phone,
  Eye,
} from "lucide-react"
import useQualifyUser from '@/hooks/useQualifyUser';
import useGetSellerApplications from "@/hooks/useGetSellerApplications"
import { Application } from "@/lib/types"
import { Id } from "../../../../convex/_generated/dataModel"
import { formatDate } from "@/lib/helpers"
import { useNotification } from "@/app/NotificationContext"


interface SellerInfo {
  phoneNumber?: string;
  email?: string;
  username?: string;
  address?: string;
}


const statusConfig = {
  pending: { color: "bg-orange-500", icon: Clock, label: "Pending" },
  approved: { color: "bg-green-500", icon: CheckCircle, label: "approved" },
}

export default function SellerApplications() {
        const { data: Applications } = useGetSellerApplications()
        const [selectedApplication, setSelectedApplication] = useState<Application |null>(null)
        const [searchTerm, setSearchTerm] = useState("")
        // const [RejectionMessage,setRejectionMessage] = useState(false)
        const [statusFilter, setStatusFilter] = useState<string>("all")
        const [activeTab, setActiveTab] = useState("all")
          const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
          const {setNotification} = useNotification()
          
    const { qualifyUser } = useQualifyUser();
        const filteredApplications = Applications?.filter((application) => {
        const matchesSearch = application?.store_name.toLowerCase().includes(searchTerm.toLowerCase())||
        application?.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application?.description.toLowerCase().includes(searchTerm.toLowerCase()) 
    const matchesStatus = statusFilter === "all" || application.status === statusFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && ["pending"].includes(application.status)) ||
      (activeTab === "approved" && ["approved"].includes(application.status))

    return matchesSearch && matchesStatus && matchesTab
  })

    useEffect(() => {
    const fetchSeller = async () => {
      if (selectedApplication?.user_id) {
        const userResult = await getUserById(selectedApplication.user_id as  Id<"customers">);
        // userResult could be { user: {...}, ... } or { user: null, ... }
        setSellerInfo(userResult.user || null);
      } else {
        setSellerInfo(null);
      }
    };
    fetchSeller();
  }, [selectedApplication]);

  const HandleUserQualify = (user_id:Id<"customers">,status:boolean)=>{
        qualifyUser(user_id,status).then((res)=>{
                if(!res.success){
                        setNotification({
                                status:"info",
                                message:res.message || "failed"
                        })
                }
                  setNotification({
                                status:"info",
                                message:res.message || "success"
                        })
        })
  }

  const getStatusBadge = (
    status: keyof typeof statusConfig
  ) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }


//   const reorderItems = (order: Order) => {
//     // This would typically add items to cart and redirect to checkout
//     console.log("Reordering items from order:", order.orderNumber)
//     // Implementation would depend on your cart/ordering system
//   }

  return (
    <div className="min-h-screen mt-20 bg-gray-50 dark:bg-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Applications</h1>
          <p className="text-gray-500">Track your current orders and view order history</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 dark:bg-gray-600">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Applications</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by order number, restaurant, or item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">pending</TabsTrigger>
            <TabsTrigger value="approved">approved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 ">
            {/* Orders List */}
            <div className="space-y-4">
              {filteredApplications?.length === 0 ? (
                <Card className="dark:bg-gray-700" >
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications found</h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "You haven't placed any orders yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications?.map((application) => (
                  <Card key={application._id} className="hover:shadow-md transition-shadow dark:bg-gray-900 ">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{application?.store_name}</h3>
                           {getStatusBadge(application.status as keyof typeof statusConfig)}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(application._creationTime)}
                            </div>
                            <div className="flex items-center gap-2">
                              <TbListDetails className="w-4 h-4" />
                              {application?.description || "No description available"}
                            </div>
                            
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details for - {selectedApplication?.store_name}</DialogTitle>
                                  <DialogDescription>
                                    Applied on {selectedApplication && formatDate(selectedApplication._creationTime)}
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedApplication && (
                                  <div className="space-y-6">
                                    <Separator />

                                    {/* Order Details */}
                                    <div>
                                      <h4 className="font-semibold mb-3">Application Details</h4>
                                      <div className="space-y-2 text-sm">
                                     <div>
                                        <h1>
                                                {selectedApplication?.description}
                                        </h1>
                                     </div>
                                     
                                        <Separator />
                                      </div>
                                    </div>

                                    <Separator />
                                    <Separator />

                                    {/* About Seller Info */}
                                    <div>
                                      <h4 className="font-semibold mb-2">About Seller </h4>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        {/* <p className="font-medium">{selectedApplication.restaurant.name}</p> */}
                                        <div className="flex items-center gap-4">
                                          <FaUser  className="w-4 h-4" />
                                           {selectedApplication?.user_id ? (sellerInfo?.username || "Anonymus") : "Anonymus"}
                                        </div>

                                        <div className="flex items-center gap-4">
                                          <Phone className="w-4 h-4" />
                                           <a href={`tel:${ sellerInfo?.phoneNumber || ""}`}>{ sellerInfo?.phoneNumber || "No phone number available"}</a> 
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <MdOutlineEmail className="w-4 h-4" />
                                           <a href={`mailto: ${sellerInfo?.email || ""}`}>{sellerInfo?.email || "No email available"}</a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {application.status != "approved" && (
                              <>
                              <Button variant="outline" className="bg-green-300 hover:bg-green-400 transition" size="sm" 
                              onClick={() => {
                                  if (application) {
                                    HandleUserQualify(application.user_id as Id<"customers">,true)
                                  }
                                }}
                                disabled={!application}
                              >
                                Approve
                              </Button>

                              <Button variant="outline" className="bg-red-300 hover:bg-red-400 transition" size="sm" 
                              onClick={() => {
                                  if (application) {
                                    HandleUserQualify(application.user_id as Id<"customers">,false)
                                  }
                                //   setRejectionMessage(true)
                                }}
                                disabled={!application}
                              >
                                Reject
                              </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}