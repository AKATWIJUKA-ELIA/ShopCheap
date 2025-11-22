"use client"

import type React from "react"
import { useEffect, useState, } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send,  Users, Mail, Calendar, FileText, Plus, X, Trash2 } from "lucide-react"
import { api } from "../../../convex/_generated/api"
import { useQuery } from "convex/react"
import useSaveNewsLetter from "@/hooks/useSaveNewsLetter"
import { formatDate } from "@/lib/helpers"
import { useNotification } from "@/app/NotificationContext"
import useDeleteSubscriber  from "@/hooks/useDeleteSubscriber"


// interface Newsletter {
//         _id?: string
//   subject: string
//   content: string
//   recipients: string[]
//   status: "sent" | "scheduled" | "failed" | "bounced"|"pending"
//   DateSent?: Date
//   scheduledTime?: Date
//   _creationTime?: number
// }

interface newNewsletter {
        _id: string
        subject: string
        content: string
        recipients: string[]
        status: "sent" | "scheduled" | "failed" | "bounced"|"pending"
        DateSent?: Date
        scheduledTime?: Date
        _creationTime: number
}


export default function NewsletterAdmin() {
  const [activeTab, setActiveTab] = useState("compose")
  const [subscriberlist, setSubscriberlist] = useState<string[]>()
  const subscribers = useQuery(api.NewsLetter.getSubscribers)
  const fetchnewsLetters = useQuery(api.NewsLetter.getNewsLetters)
  const { save } = useSaveNewsLetter()
  const {setNotification} = useNotification()
  const {handleDelete} = useDeleteSubscriber()

  useEffect(() => {
        if(subscribers && subscribers.length > 0) {
                  console.log("Subscribers:", subscribers)
                  setSubscriberlist(subscribers.map((subscriber) => subscriber.email))
                   console.log("subscriberlist:", subscriberlist)
        }
  },[subscribers])

  const [newsletter, setNewsletter] = useState<{
    subject: string
    content: string
    recipients: string[]
    status: "pending"
    scheduledTime: Date
  }>({
    subject: "",
    content: "",
    recipients: [],
    status: "pending",
    scheduledTime: new Date()  
  })

  const [newsletters, setNewsletters] = useState<newNewsletter[]>([])

  useEffect(()=>{
        if(fetchnewsLetters && fetchnewsLetters.length > 0) {
          console.log("Fetched Newsletters:", fetchnewsLetters)
          setNewsletters(fetchnewsLetters.map((newsletter) => ({
                subject: newsletter.subject,
                content: newsletter.content,
                recipients: newsletter.receipients,
                status: newsletter.status,
                DateSent: newsletter.DateSent ? new Date(newsletter.DateSent) : undefined,
                scheduledTime: newsletter.scheduledTime ? new Date(newsletter.scheduledTime) : undefined,
                _id: newsletter._id,
                _creationTime: newsletter._creationTime || Date.now()
          })))
        }
  },[fetchnewsLetters])

  const RemoveEmail =(email: string) => {
        handleDelete(email)
          .then((data) => {
                if(!data.success){
                        setNotification({
                  status: "error",
                  message: data.message,
                })
                }
                setNotification({
                  status: "success",
                  message: `Subscriber ${email} deleted successfully`,
                })
                
          })
  }

  const handleSaveLetter = () => {
        if(newsletter.scheduledTime && newsletter.scheduledTime < new Date()) {
                setNotification({
                        status: "error",
                        message: "Scheduled time must be in the future",
                })
         
          return

        }
    const newNewsletter = {
      subject: newsletter.subject,
      content: newsletter.content,
      recipients: newsletter.recipients,
      status: "pending" as "pending"| "sent" | "scheduled" | "failed" | "bounced",
      scheduledTime: newsletter.scheduledTime ,
    }
    save(newNewsletter)
    setNotification({
                        status: "success",
                        message: "Newsletter saved successfully",
                })
    setNewsletter({
      subject: "",
      content: "",
      recipients: [],
      status: "pending",
      scheduledTime: new Date()
    })
  }

  const removeEmailFromRecipients = (email: string) => {
    setNewsletter((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((r) => r !== email),
    }))
  }

  const addListToRecipients = (list: string[]) => {
    if (list) {
      setNewsletter((prev) => ({
        ...prev,
        recipients: [...new Set([...prev.recipients, ...list])],
      }))
    }
  }


  return (
    <div className="min-h-screen mt-20 bg-gray-50 dark:bg-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Newsletter Admin</h1>
          <p className="text-gray-600 mt-2">Create, manage, and send newsletters to your subscribers</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="recipients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipients
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="dark:bg-gray-600" >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Newsletter Composer
                      
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <>
                        <div>
                          <Label htmlFor="subject">Subject Line</Label>
                          <Input
                            id="subject"
                            placeholder="Enter newsletter subject..."
                            value={newsletter.subject}
                            onChange={(e) => setNewsletter((prev) => ({ ...prev, subject: e.target.value }))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            placeholder="Write your newsletter content here..."
                            value={newsletter.content}
                            onChange={(e) => setNewsletter((prev) => ({ ...prev, content: e.target.value }))}
                            className="mt-1 h-[300px]"
                          />
                        </div>

                        <div>
                          <Label htmlFor="scheduledTime">Schedule Time</Label>
                         <Input
                         id="scheduledTime"
                        type="datetime-local"
                        required
                        min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                        value={newsletter.scheduledTime
                        ? new Date(newsletter.scheduledTime.getTime() - newsletter.scheduledTime.getTimezoneOffset() * 60000)
                                .toISOString().slice(0, 16)
                        : ""
                        }
                        onChange={(e) => {
                        if (!e.target.value) {
                        setNewsletter((prev) => ({ ...prev, scheduledTime: new Date() }));
                        return;
                        }
                        
                        // Create date in local timezone
                        const localDate = new Date(e.target.value);
                        
                        // Check if it's in the future
                        if (localDate < new Date()) {
                        setNotification({
                        status: "error",
                        message: "Scheduled time must be in the future",
                })
                        return;
                        }
                        
                        setNewsletter((prev) => ({
                        ...prev,
                        scheduledTime: localDate
                        }));
                        }}
                        className="mt-1"
                        />
                        </div>
                      </>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="dark:bg-gray-600" >
                  <CardHeader>
                    <CardTitle className="text-lg">Recipients</CardTitle>
                    <CardDescription>{newsletter.recipients.length} recipients selected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Email Lists</Label>
                        <div className="mt-2 space-y-2">
                          
                            <div  className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">All Subscribers</p>
                                <p className="text-xs text-gray-500">{subscriberlist?.length} emails</p>
                              </div>
                              <Button size="sm" variant="outline" 
                              onClick={() => addListToRecipients(subscriberlist||[])}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                         
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium">Selected Recipients</Label>
                        <ScrollArea className="h-32 mt-2">
                          <div className="space-y-1">
                            {newsletter.recipients.map((email, index) => (
                              <div key={index} className="flex items-center justify-between p-1">
                                <span className="text-sm">{email}</span>
                                <Button size="sm" variant="ghost" onClick={() => removeEmailFromRecipients(email)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gray-600" >
                  <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                    onClick={handleSaveLetter} 
                      className="w-full"
                      disabled={!newsletter.subject || !newsletter.content || newsletter.recipients.length === 0 ||newsletter.scheduledTime === undefined}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Save and Send Newsletter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-6">
            <div className="grid grid-cols-1 2 gap-6">
              <Card className="dark:bg-gray-600" >
                <CardHeader>
                  <CardTitle>Email Lists</CardTitle>
                  <CardDescription>Manage your subscriber lists</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriberlist?.map((list,index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{list}</h3>
                          <Button variant="destructive" className="hover:bg-red-700"
                          onClick={()=>RemoveEmail(list)}
                          > <Trash2/>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Newsletter History 
                         {newsletters && (
                            <Badge variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              {newsletters.length}
                            </Badge>
                          )}
                </CardTitle>
                <CardDescription>View and manage your sent newsletters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsletters.map((newsletter) => (
                    <div key={newsletter._id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{newsletter.subject}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={newsletter.status === "sent" ? "default" : "secondary"}>
                            {newsletter.status}
                          </Badge>
                          
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{newsletter.content.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created: { formatDate(newsletter._creationTime)}</span>
                      </div>
                       <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>scheduled: { formatDate(newsletter.scheduledTime ? newsletter.scheduledTime.getTime() : 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Date Sent: {  formatDate(newsletter.DateSent ? newsletter.DateSent.getTime() : 0)}</span>
                      </div>
                      {newsletter.recipients && <span>Receipients: [ {newsletter.recipients.join(",  ")} ]</span>}

                       
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
