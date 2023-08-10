const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menu-item");
const ServiceProvider = require("../models/service-provider");
const security = require("../middleware/security");
const crypto = require('crypto')
const sharp = require('sharp')
require('dotenv').config()


const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const { S3Client, PutObjectCommand,GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const BUCKET_NAME = process.env.BUCKET_NAME
const BUCKET_REGION = process.env.BUCKET_REGION
const BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY
const BUCKET_SECRET_ACCESS_KEY = process.env.BUCKET_SECRET_ACCESS_KEY

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

async function  getImageUrl(item){
  const getObjectParams= {
    Bucket: BUCKET_NAME,
    Key: item.image_url
  }
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, {expiresIn: 3600})
  return url
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_ACCESS_KEY
    },
  region: BUCKET_REGION
})

router.post("/create", security.extractUserFromJWT, upload.single("image"), async (req, res, next) => {
  try {
    console.log("req.body", req.body)
    console.log("req.file", req.file)
    
    // const buffer = await sharp(req.file.buffer).resize({height: 50, width:50, fit:"fill"}).toBuffer()
    const imageName = randomImageName()
    
    const params =  {
      Bucket: BUCKET_NAME,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    } 

    const putCommand = new PutObjectCommand(params)
    await s3.send(putCommand)

    const { user } = res.locals;
    const provider = user;
    const newMenuItem = await MenuItem.addMenuItem({
      provider,
      item: req.body,
      image_name: imageName
    });

    newMenuItem.image_url = await getImageUrl(newMenuItem)
    console.log('done waiting')
    return res.status(201).json({ newMenuItem });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const menuItems = await MenuItem.listMenuItems(id);
    for (const menuItem of menuItems) {
      menuItem.image_url = await getImageUrl(menuItem)
    }
    return res.status(200).json({ menuItems });
  } catch (err) {
    next(err);
  }
});

router.get("/food/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const menuItem = await MenuItem.fetchMenuItem(id);
    menuItem.image_url = await getImageUrl(menuItem)
    return res.status(200).json({ menuItem });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
