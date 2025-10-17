"use client"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
        //  Facebook, Instagram, Youtube,
         Twitter, 
         Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { useSendMail } from "@/hooks/useSendMail"
import useAddEmail from "@/hooks/useAddEmail"
import { useState } from "react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [useremail,setuseremail] = useState("")
  const[submitting,setIsSubmitting] = useState(false)
  const [submitted,setsubmitted] = useState(false)
   const [ErrorMailMessage, setErrorMailMessage ] = useState<string>('')
  const {sendEmail}  = useSendMail()
  const { save } = useAddEmail();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setuseremail(e.target.value) 
       
  }

  const cleanForm = () => {
        setuseremail("")
      }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)
      
        const saveEmail = await save(useremail)

if ( !saveEmail.success ) {
        setIsSubmitting(false)
         setErrorMailMessage(saveEmail.error)
         setTimeout(()=>{
                setErrorMailMessage('')
         },4000)
         cleanForm()
    return            
}
try {
        const html = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    .button {
      display: inline-block;
      padding: 14px 28px;
      font-size: 16px;
      color: #fff;
      background-color: #007bff;
      border-radius: 5px;
      text-decoration: none;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .container {
      max-width: 480px;
      margin: auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 32px;
      font-family: Arial, sans-serif;
      color: black;
    }
    .footer {
      font-size: 12px;
      color: #999;
      margin-top: 32px;
      text-align: center;
    }
  </style>
</head>
<body style="background:#f4f4f4;">

  <div class="container">
<a href="https://shopcheapug.com/" > 
<div 
  style="
    background-image: url('https://cheery-cod-687.convex.cloud/api/storage/143325e4-3c05-4b88-82ba-cbbfa7fcd594');
    background-size: contain;  
    background-repeat: no-repeat;
    background-position: center; 
    width: 200px;
    height: 100px;
  "
>
  
</div></a>
    <h2><strong>Welcome to ShopCheap - Thanks for Subscribing!</strong></h2>
    <h1 class="" style="color:black" >Hello, <span style="color:blue"> ${useremail} </span></h1>
    <h3>Thank you for subscribing to ShopCheap! We're thrilled to have you on board.

Now, you'll be the first to receive exclusive updates, tips, promotions, or industry insights. Expect valuable content delivered straight to your inbox .

If you ever have questions or feedback, just reply to this email—we'd love to hear from you!\n

Thanks again for joining us. Stay tuned for your first edition!\n

Best regards,\n
ShopCheap\n
https://shopcheapug.com/</h3>
    <div class="footer">
      &copy; 2025 ShopCheap. All rights reserved.
    </div>
  </div>
</body>
</html>`
sendEmail(useremail, "Welcome to ShopCheap - Thanks for Subscribing!", html,"marketing")
setTimeout(() => {
        setIsSubmitting(false);
        setsubmitted(true)
      }, 5000); 
        } catch (error) {
        console.error("Error :", error)
        
      } finally {
        setTimeout(() => {
                setIsSubmitting(false);
                 setErrorMailMessage("")
                setsubmitted(false)
              }, 10000); 
        cleanForm()
      }
    }
//   console.log(useremail)

  return (
        <footer className="bg-dark  border-t dark:bg-gray-900 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          {/* Newsletter Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-10 dark:bg-gray-800 dark:shadow-md">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Subscribe To Our <span className="text-gold">Newsletter</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get the latest updates, deals and exclusive offers directly to your inbox.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {submitted && (
                  <div>
                    <h1 className="text-green-500">Success!!!! Check your email for more details</h1>
                  </div>
                )}
                {ErrorMailMessage && ErrorMailMessage.length>0 && (
                  <div>
                    <h1 className="text-red-500 font-bold ">Error!! {ErrorMailMessage}</h1>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={useremail}
                    onChange={handleChange}
                    type="email"
                    placeholder={submitting ? "Submitting ..." : "Your email address"}
                    className="max-w-md border-black dark:border-gray-600"
                  />
                  <Button
                  disabled={submitting || useremail.length===0}
                   type="submit" className="bg-gold">
                    Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
      
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="flex flex-col text-gray-600 dark:text-gray-300 items-center  space-y-4 gap-6 ">
              
              <div className=" flex p-4 space-y-3">
                <Link href="/" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  <div className='flex rounded-md ml-5'>
                                <Image 
                                 src="/images/Logo1.png"
                                  alt='logo'
                                   width='200'
                                    height="100"
                                    className=' h-12'
                                    />
                        </div>
                </Link>
                
              </div>
              <h4 className="font-bold text-lg text-white mb-4 dark:text-gray-100">Anytime  Anywhere ... </h4>
            </div>
      
            {/* Customer Service */}
            <div>
              <h4 className="font-bold text-lg text-white mb-4 dark:text-gray-100">Customer Service</h4>
              <div className="space-y-3">
                <Link href="/about" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  About Us
                </Link>
                <Link href="/register" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Sell on ShopCheap
                </Link>
                {/* <Link href="/returns" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Returns & Exchanges
                </Link> */}
                <Link href="/profile/orders" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Order Tracking
                </Link>
                {/* <Link href="/gift-cards" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Gift Cards
                </Link> */}
                {/* <Link href="/contact" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Contact Us
                </Link> */}
              </div>
            </div>
      
            {/* Account */}
            <div>
              <h4 className="font-bold text-white text-lg mb-4 dark:text-gray-100">My Account</h4>
              <div className="space-y-3">
                <Link href="/sign-in" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Sign In
                </Link>
                <Link href="/sign-up" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Create Account
                </Link>
                <Link href="/cart" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Shopping Cart
                </Link>
                <Link href="/profile/bookmarks" className="block text-gray-600 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-300">
                  Bookmarks
                </Link>
              </div>
            </div>
      
            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-lg text-white mb-4 dark:text-gray-100">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-600 mt-0.5 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    32 km Gayaza-Zirobwe Rd
                    <br />
                    Bugema University
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <a href="tel:+256 787357137">+256 787357137</a>
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-600 dark:text-gray-300">
                    <a href="mailto: eliaakjtrnq@gmail.com">eliaakjtrnq@gmail.com</a>
                  </span>
                </div>
      
                {/* Social Media */}
                <div className="mt-6">
                  <h5 className="font-medium text-gold mb-3">Follow Us</h5>
                  <div className="flex space-x-4">
                    {/* <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Facebook className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">Facebook</span>
                    </a> */}
                    {/* <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Instagram className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">Instagram</span>
                    </a> */}
                    <a
                      href="https://x.com/shopcheap__"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Twitter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">Twitter</span>
                    </a>
                    {/* <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 p-2 rounded-full hover:bg-gold transition-colors dark:bg-gray-700 dark:hover:bg-orange-400"
                    >
                      <Youtube className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="sr-only">YouTube</span>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
      
          <Separator className="my-6 dark:border-gray-600" />
      
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="mb-4 md:mb-0">© {currentYear} ShopCheap. All rights reserved.</div>
            <div className="flex flex-wrap gap-4 justify-center">
              {/* <Link href="/privacy-policy" className="hover:text-orange-400 dark:hover:text-orange-300">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-orange-400 dark:hover:text-orange-300">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-orange-400 dark:hover:text-orange-300">
                Accessibility
              </Link> */}
              <Link href="/sitemap" className="hover:text-orange-400 dark:hover:text-orange-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
  )
}
