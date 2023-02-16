const path = require('path')

const uploadImage = async (img) =>{
    const imageNamePrefix = Date.now()
    const imageName = imageNamePrefix + '_' + img.name
    const imgPath = path.join(__dirname, '../public/images/' + imageName)
    await img.mv(imgPath)
    return '/images/'+imageName
}

module.exports = {uploadImage}