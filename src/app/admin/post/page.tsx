"use client"
// import { useUser } from '@clerk/nextjs';
import React, { useRef, useState } from 'react'
import { api } from '../../../../convex/_generated/api';
import { useMutation } from 'convex/react';
import { useSendMail } from '@/hooks/useSendMail';
import useGetCategories from '@/hooks/useGetCategories';
import { useAppSelector } from '@/hooks';
// import useGenerateEmbeddings from '@/hooks/useGenerateEmbeddings';
// import useGenerateImageEmbeddings from '@/hooks/useGenerateImageEmbeddings';
import useCreateProduct from '@/hooks/useCreateProduct';
import Image from 'next/image';

  interface Product {
                approved: boolean,
                product_cartegory: string,
                product_condition: string,
                product_description: string,
                product_image: string[],
                product_name: string,
                product_owner_id: string,
                product_price: string,
                product_embeddings:number[],
                product_image_embeddings:number[]
                }

const AddProduct =  () => {
        
      const generateUploadUrl = useMutation(api.products.generateUploadUrl);
      const [selectedImage, setSelectedImage] = useState<File[] | []>([]);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const { sendEmail, } = useSendMail();
      const { data: categories } = useGetCategories(); 
      const[successProduct,setsuccessProduct] = useState("")
      const [ErrorProduct,setErrorProduct] = useState("")
      const [imagePreview, setImagePreview] = useState<string[]>([])
      const admin = process.env.NEXT_PUBLIC_ADMIN
//       const {Embed} = useGenerateEmbeddings();
//       const {EmbedImage} = useGenerateImageEmbeddings();
      const {CreateProduct} = useCreateProduct()
      const [isSubmitting, setIsSubmitting] = useState(false);
      const user = useAppSelector((state)=>state.user.user)
      const userid = user?.User_id || ''

        const [product, setProduct] = useState<Product>({
                approved: false,
                product_cartegory: "",
                product_condition: "",
                product_description: "",
                product_image: [],
                product_name: "",
                product_owner_id: "",
                product_price: "",
                product_embeddings:[],
                product_image_embeddings:[]
        });
        
        const cleanImageField=()=>{
                        setSelectedImage([]);
                        setImagePreview([])
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                }
        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) {
                      const filesArray = Array.from(e.target.files)
                      const maxFileSize = 3 * 1024 * 1024; // 1MB in bytes
                      const validFiles: File[] = [];
                      for (const file of filesArray) {

                        if (!file.type.startsWith("image/")) {
                                alert(`"${file.name}" is not a valid image file.`);
                                cleanImageField();
                                return; 
                              }

                              if (file.size > maxFileSize) {
                                alert(`"${file.name}" is too large. Maximum allowed size is 3MB.`);
                                cleanImageField()
                              } else {
                                validFiles.push(file);
                              }
                            }
                   
                    // Check if adding these files would exceed the 5 image limit
                    if (validFiles.length > 5) {
                      alert("You can only upload up to 5 images")
                      cleanImageField()
                      return
                    }
              
                    setSelectedImage(validFiles)
                    // Create preview URLs for the selected images
                    const previewUrls = validFiles.map((file) => URL.createObjectURL(file))
                    setImagePreview(previewUrls)
                  }
                }
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                  const { name, value } = e.target;
                  setProduct((prev) => ({...prev,[name]: value,
                  }));
                };

        const cleanForm = () => {
                setProduct({
                        approved: false,
                        product_cartegory: "",
                        product_condition: "",
                        product_description: "",
                        product_image: [],
                        product_name: "",
                        product_owner_id: "",
                        product_price: "",
                        product_embeddings:[],
                        product_image_embeddings:[]
                });
                setSelectedImage([]);
                if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                        }
        };

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setErrorProduct("");
                  setsuccessProduct("");
                  const TIMEOUT_MS = 20000; 

                const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
                        return Promise.race([
                          promise,
                          new Promise<T>((_, reject) =>
                            setTimeout(() => reject(new Error("Request timed out")), ms)
                          
                          ),
                        ]);
                      };

                  try {
                        await withTimeout((async () => {
                         // Step 1: Get a short-lived upload URL
                        const postUrl = await generateUploadUrl();
                        const responses = await Promise.all(
                                Array.from(selectedImage || []).map(async (image: File) => {
                                  const result = await fetch(postUrl, {
                                    method: "POST",
                                    headers: { "Content-Type": image.type },
                                    body: image,
                                  });
                            
                                  if (!result.ok) throw new Error("Failed to upload image");
                                  return result.json(); 
                                })
                        );
                        // const imageEmbeds = await EmbedImage(Array.from(selectedImage || []))
                        const storageIds = responses.map((res) => res.storageId);
                        // const  embeds = await Embed(product.product_name + product.product_description + product.product_cartegory);
                        
                        // if(!embeds.success){
                        //         setErrorProduct("Error!  failed to generate embedings")
                        //         setTimeout(()=>{
                        //                 setErrorProduct('')
                        //         },5000)
                        //         // return
                        // }

                        // if(!imageEmbeds.success){
                        //         setErrorProduct("Error!  failed to generate Image embedings")
                        //         setTimeout(()=>{
                        //                 setErrorProduct('')
                        //         },5000)
                        //         // return
                        // }
                        
                        const updatedproduct = {
                                ...product,
                                product_image: [...storageIds], // Ensure new IDs are included
                                product_name: product.product_name,
                                product_description: product.product_description,
                                product_owner_id: userid,
                                product_cartegory: product.product_cartegory,
                                approved: false,
                                // product_embeddings:embeds.data||[],
                                // product_image_embeddings:imageEmbeds.data? imageEmbeds.data[0] || [] :[]
                        };
                            
                        // console.log("Updated Product: ", updatedproduct);
                        const create =  await CreateProduct( updatedproduct);
                        const res = await create.json()
                        if(!res.success){
                                setErrorProduct(res.message)
                                return
                        }
                        setsuccessProduct(res.message)
                      cleanForm()
                      cleanImageField()
                      setImagePreview([])
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
    <h2><strong>New Product Created !</strong></h2>
    <h1 class="" style="color:black" >Hello, <span style="color:blue"> ${user?.Username}</span></h1>
    <h3>
    Your Product was Created Successfully and is pending for Approval You will Be Notified Once Your Product is Approved\n

If you ever have questions or feedback, just reply to this email—we'd love to hear from you!\n

Best regards,\n
ShopCheap\n
https://shopcheapug.com/</h3>
    <div class="footer">
      &copy; 2025 ShopCheap. All rights reserved.
    </div>
  </div>
</body>
</html>
                      `
                      sendEmail( `${admin}` ,"New Product Created", `User ${user?.Username}, Added a product`,"sales");
                      sendEmail( `${user?.email}`,"New Product Created", html,"sales");
                })(), TIMEOUT_MS);
                  } catch (error) {
                        setErrorProduct("Error creating product")
                    console.error("Error creating product:", error);
                    setTimeout(()=>{
                        setErrorProduct("")
                    },4000)
                  } finally {
                    setIsSubmitting(false);
                     setTimeout(()=>{
                        setErrorProduct("")
                        setsuccessProduct("")
                    },4000)
                    return;
                  }
                };

  return (
     <div className=' mt-44 md:mt-32 md:w-[50%]  items-center justify-center  mx-auto bg-gray-200 dark:bg-dark rounded-lg ' >
        {successProduct && successProduct.length > 0
        ? (<h1 className='text-xl  text-center text-green-500 ' > Success😁,  your product  is pending for Approval</h1>)
        :(<h1 className='text-2xl font-bold text-center text-black dark:text-white ' >Add  Products</h1>)
        }
        {ErrorProduct && ErrorProduct.length>0 && <h1 className='text-2xl font-bold text-center text-red-500 ' >Error creating product 😔 Please try again later or contact support</h1>}
      
       <form onSubmit={handleSubmit} className="space-y-4 p-3 ">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white ">
          Product Name
        </label>
        <input
          type="text"
          id="product_name"
          name="product_name"
          value={product.product_name}
          onChange={handleChange}
          required
           className="bg-transparent rounded-lg relative block w-full px-3 py-2 border border-double border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-4  focus:border-gray-500 focus:z-10 sm:text-sm dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white ">
          Description
        </label>
        <textarea
          id="product_description"
          name="product_description"
          value={product.product_description}
          onChange={handleChange}
          required
           className="bg-transparent rounded-lg relative block w-full px-3 py-2 border border-double border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-4  focus:border-gray-500 focus:z-10 sm:text-sm dark:text-white"
        ></textarea>
      </div>

      <div className='flex md:flex gap-2 md:gap-12'>
      <div>
        <label htmlFor="cartegory" className="flex text-sm font-medium text-gray-700 dark:text-white ">
          Cartegory
        </label>
        <select
          id="product_cartegory"
          name="product_cartegory"
          onChange={handleChange}
          required
           className="bg-transparent rounded-lg relative block w-full px-3 py-2 border border-double border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-4  focus:border-gray-500 focus:z-10 sm:text-sm dark:text-white dark:bg-dark"
        >
                <option value=""  >Select category</option>
                {categories?.map((category,index) => (
                <option key={index} value={category.cartegory}>
                  {category.cartegory}
                </option>
              ))}
              </select>
      </div>
      
      <div>
        <label htmlFor="condition" className="flex text-sm font-medium text-gray-700 dark:text-white">
          Condition
        </label>
        <input
          type="text"
          id="product_condition"
          name="product_condition"
          value={product.product_condition}
          onChange={handleChange}
          required
           className="bg-transparent rounded-lg relative block w-full px-3 py-2 border border-double border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-4  focus:border-gray-500 focus:z-10 sm:text-sm dark:text-white "
        />
      </div>
      </div>
      <div>
        <label htmlFor="price" className="flex text-sm font-medium text-gray-700 dark:text-white">
          Price
        </label>
        <input
          type="number"
          id="product_price"
          name="product_price"
          value={product.product_price}
          onChange={handleChange}
          onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
          required
           className="bg-transparent rounded-lg relative block w-full px-3 py-2 border border-double border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:border-4  focus:border-gray-500 focus:z-10 sm:text-sm dark:text-white "
        />
      </div>
      <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-white">
            Attach an Image (Upto 5 images)
          </label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          { imagePreview.length > 0 && (
              <div className="">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Images: {selectedImage?.length} of 5 images selected</p>  
                <div className="flex flex-wrap gap-2">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              
              </div>
            )}
        </div>

      <div>
      
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Post Product"}
        </button>
      </div>
    </form>
     </div>
  )
}

export default AddProduct