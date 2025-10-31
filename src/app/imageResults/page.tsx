"use client"
import React, { useEffect, useState }  from 'react'
import { useFile } from '../FileContext'
import Categories from '@/components/Category/page'
import useGenerateImageEmbeddings from '@/hooks/useGenerateImageEmbeddings'
// import { useRouter } from 'next/navigation'; 
import useImageSearch from '@/hooks/useImageSearch'
import { Oval } from 'react-loader-spinner'

const ImageResults =  () => {
        const { file } = useFile();
        const [data,setData] = useState([])
        const {EmbedImage} = useGenerateImageEmbeddings()
        const [loading, setLoading] = useState(true);
        const imageSearch = useImageSearch();
        const ImageVectorSearch = imageSearch?.ImageVectorSearch;
        
useEffect(() => {
         
                const ImageEmbed = async(files:File[]) =>{
                const embeds = await EmbedImage(files);
                
                if(!embeds.success){
                        // console.log("Error while generating embeddings",embeds.status)
                        return;
                }       
                let response;
                if (ImageVectorSearch) {
                    response = await ImageVectorSearch(embeds.data?embeds.data[0] || []:[]);
                    console.log("ImageVectorSearch response:", response);
                    setData(response||[]);
                    setLoading(false);
                } else {
                //     console.error("ImageVectorSearch is undefined");
                }
        }
         ImageEmbed(file);
}, [file]);
        
        return (
            <div >
                {loading ? (<div className='flex justify-center items-center h-screen'>
                        <Oval
                                visible={true}
                                height="70"
                                width="70"
                                color="#0000FF"
                                secondaryColor="#FFD700"
                                ariaLabel="oval-loading"
                                />
                                </div>):(
                    <div>
                         <Categories relatedProducts={data||[]} category='' image={file[0]} />
                    </div>
                )}
               
            </div>
        ); 
}

export default ImageResults