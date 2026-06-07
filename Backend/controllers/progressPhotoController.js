// const ProgressPhoto = require(
//   "../models/ProgressPhoto"
// );

// const uploadPhoto = async (req, res) => {
//   try {
//     console.log("REQ FILE:", req.file);
//     console.log("REQ USER:", req.user);

//     const photo = await ProgressPhoto.create({
//       user: req.user.id,
//       imageUrl: req.file.filename,
//     });

//     res.status(201).json(photo);
//   } catch (error) {
//     console.log("UPLOAD ERROR:", error);

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const getPhotos = async (
//   req,
//   res
// ) => {
//   try {
//     const photos =
//       await ProgressPhoto.find({
//         user: req.user.id,
//       }).sort({
//         createdAt: -1,
//       });

//     res.json(photos);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   uploadPhoto,
//   getPhotos,
// };