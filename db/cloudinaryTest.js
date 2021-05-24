import cloudinary from 'cloudinary'



const cloudinaryConnection = cloudinary.v2

cloudinaryConnection.config({
  cloud_name: 'dvpwosiqu',
  api_key: '352115968788925',
  api_secret: 'Vv8BqmLXILQbg41sehHMOQHkuWM'
})

console.log('')

async function uploadImage() {
  try {
    const uploadedImage = await cloudinaryConnection.url("samples/landscapes/nature-mountains.jpg")
    console.log(uploadedImage)
  } catch (err) {
    console.log(err)
  }

}


uploadImage()