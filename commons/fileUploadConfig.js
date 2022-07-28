const fileUploadConfig = {
  image: ['.gif','.jpg','.jpeg','.png','.svg'],
  excel: ['.xls','.xlsx'],
  maxImageSize: 2, //in MB
  maxImageDimensions: { //Width and height are in px, allowed variation is in percentage
    categoryImage: {
      maxWidth: 155,
      maxHeight: 155,
      allowedVarition: 5/100,
    },
    serviceImage: {
      maxWidth: 155,
      maxHeight: 155,
      allowedVarition: 5/100,
    },
    variantImage: {
      maxWidth: 280,
      maxHeight: 150,
      allowedVarition: 5/100,
      limit: 10
    },
    variantThumbnail: {
      maxWidth: 25,
      maxHeight: 25,
      allowedVarition: 5/100,
    }
  }
}

export default fileUploadConfig;