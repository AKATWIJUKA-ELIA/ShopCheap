// import React, { useState, useCallback } from "react";
// import Cropper from "react-easy-crop";

// interface ImageCropperProps {
//   imageSrc: string;
// //   onCropComplete: (croppedImage: string) => void;
// }

// export default function ImageCropper({ imageSrc,  }: ImageCropperProps) {
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

// const onCropComplete = () => {
//     setCroppedAreaPixels(croppedAreaPixels)
//   }

//   // This function converts the cropped area to a blob or file
//   const showCroppedImage = async () => {
//     const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
//     onCropComplete(croppedImage); // Send result to parent or save
//   };

//   return (
//     <div>
//       <div style={{ position: "relative", width: 400, height: 200 }} className="bg-dark">
//         <Cropper
//           image={imageSrc}
//           crop={crop}
//           zoom={zoom}
//           aspect={16/9} // Set aspect ratio for avatar (1), cover (e.g. 16/9)
//           onCropChange={setCrop}
//           onZoomChange={setZoom}
//           onCropComplete={showCroppedImage}
//         />
//       </div>
//       <button className="bg-gold mt-2 rounded-lg p-2 hover:bg-gold/80 transition-colors duration-150"  onClick={showCroppedImage}>Crop & Save</button>
//     </div>
//   );
// }
