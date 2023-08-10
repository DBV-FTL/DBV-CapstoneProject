const express = require("express");
const router = express.Router();
const security = require("../middleware/security");
const Orders = require("../models/orders");

const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const { S3Client, PutObjectCommand,GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const BUCKET_NAME = process.env.BUCKET_NAME
const BUCKET_REGION = process.env.BUCKET_REGION
const BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY
const BUCKET_SECRET_ACCESS_KEY = process.env.BUCKET_SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_ACCESS_KEY
    },
  region: BUCKET_REGION
})

async function  getImageUrl(item){
  const getObjectParams= {
    Bucket: BUCKET_NAME,
    Key: item.image_url
  }
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, {expiresIn: 3600})
  return url
}

router.post("/create", security.extractUserFromJWT, async (req, res, next) => {
  try {
    const { user } = res.locals;
    console.log("create order", user, req.body);
    const newOrder = await Orders.addOrder({ item: req.body.item, user });
    setTimeout(() => {
      console.log("new order", newOrder, new Date());
    }, 5000);
    return res.status(200).json({ newOrder });

  } catch (err) {
    next(err);
  }
});

router.get("/previous", security.extractUserFromJWT, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const listOrders = await Orders.listOrders({ user });
    for (const listOrder of listOrders){
          listOrder.image_url = await getImageUrl(listOrder)
    }
    return res.status(201).json({ listOrders });
  } catch (err) {
    next(err);
  }
});


router.get("/provider-previous", security.extractUserFromJWT, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const listOrders = await Orders.listProviderOrders({ user });
    for (const listOrder of listOrders){
      listOrder.image_url = await getImageUrl(listOrder)
}
    return res.status(201).json({ listOrders });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
