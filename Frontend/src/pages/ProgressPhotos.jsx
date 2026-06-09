// import { useEffect, useState } from "react";
// import API from "../services/api";

// function ProgressPhotos() {
//   const [photo, setPhoto] = useState(null);
//   const [photos, setPhotos] = useState([]);

//   console.log("Component Render");
// console.log("Photo State:", photo);x

//   const fetchPhotos = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await API.get(
//         "/progress-photos",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPhotos(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchPhotos();
//   }, []);

//  const uploadPhoto = async () => {
//   console.log("PHOTO STATE:", photo);

//   if (!photo) {
//     alert("Select a photo first");
//     return;
//   }

//   try {
//       const token = localStorage.getItem("token");

//       const formData = new FormData();
//       formData.append("photo", photo);

// console.log(
//   "FORMDATA PHOTO:",
//   formData.get("photo")
// );
//       await API.post(
//   "/progress-photos",
//   formData,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );

//       setPhoto(null);
//       fetchPhotos();
//       window.location.reload();

//       alert("Photo uploaded!");
//     } catch (error) {
//       console.log(error);
//       alert("Upload failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-4xl font-bold mb-6">
//         Progress Photos 📸
//       </h1>

//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//        <input
//   type="file"
//   accept="image/*"
//   onChange={(e) => {
//     const selectedFile = e.target.files[0];

// console.log("SELECTED FILE:", selectedFile);

//     setPhoto(selectedFile);
//   }}
// />

// <button
//   type="button"
//   onClick={() => {
//     console.log("Current photo:", photo);
//     alert(photo ? photo.name : "NULL");
//   }}
// >
//   Test Photo
// </button>

//         <button
//           onClick={uploadPhoto}
//           className="bg-blue-600 text-slate-900 px-5 py-2 rounded-lg ml-4"
//         >
//           Upload
//         </button>
//       </div>

// {photos.length >= 2 && (
//   <div className="bg-white p-6 rounded-xl shadow mt-8">
//     <h2 className="text-2xl font-bold mb-4">
//       Before vs After 🔥
//     </h2>

//     <div className="grid md:grid-cols-2 gap-6">
//       <div>
//         <p className="font-semibold mb-2">
//           First Photo
//         </p>

//         <img
//           src={`http://localhost:5000/uploads/${photos[0].imageUrl}`}
//           alt="before"
//           className="rounded-xl w-full h-80 object-cover"
//         />
//       </div>

//       <div>
//         <p className="font-semibold mb-2">
//           Latest Photo
//         </p>

//         <img
//           src={`http://localhost:5000/uploads/${photos[photos.length - 1].imageUrl}`}
//           alt="after"
//           className="rounded-xl w-full h-80 object-cover"
//         />
//       </div>
//     </div>
//   </div>
// )}

//       <div className="grid md:grid-cols-3 gap-6">
//         {photos.length > 0 ? (
//           photos.map((photo) => (
//             <img
//             key={photo._id}
//             src={`http://localhost:5000/uploads/${photo.imageUrl}`}
//             alt="progress"
//             className="rounded-xl h-72 w-full object-cover shadow"
//             onError={(e) => {
//              e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
//             }}
//             />
//           ))
//         ) : (
//           <p>No photos uploaded yet.</p>
//         )}
//       </div>


      
//     </div>
//   );
// }

// export default ProgressPhotos;