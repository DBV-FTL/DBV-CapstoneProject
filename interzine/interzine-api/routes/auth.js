const express = require("express");
const router = express.Router();
const generateAuthToken = require("../utils/tokens");
const User = require("../models/user");
const ServiceProvider = require("../models/service-provider");
const security = require("../middleware/security");
const crypto = require("crypto");
const sharp = require("sharp");
require("dotenv").config();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const BUCKET_ACCESS_KEY = process.env.BUCKET_ACCESS_KEY;
const BUCKET_SECRET_ACCESS_KEY = process.env.BUCKET_SECRET_ACCESS_KEY;

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

async function getImageUrl(item) {
  const getObjectParams = {
    Bucket: BUCKET_NAME,
    Key: item.profile_picture,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}

async function getHeroImageUrl(item) {
  const getObjectParams = {
    Bucket: BUCKET_NAME,
    Key: item.service_provider_hero,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}

router.post("/user/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    const token = generateAuthToken({ ...user, client: "user" });
    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.post("/user/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body);
    const token = generateAuthToken({ ...user, client: "user" });
    return res.status(200).json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.put("/user", security.extractUserFromJWT, async (req, res, next) => {
  try {
    const { user } = res.locals;
    const updatedUser = await User.updateZipCode(user, req.body);
    return res.status(200).json({ updatedUser });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/provider/register",
  upload.single("image"),
  async (req, res, next) => {
    try {
      console.log("req.body", req.body);
      console.log("req.file", req.file);

      // const buffer = await sharp(req.file.buffer).resize({height: 50, width:50, fit:"fill"}).toBuffer()
      const imageName = randomImageName();

      const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const putCommand = new PutObjectCommand(params);
      await s3.send(putCommand);

      const provider = await ServiceProvider.register({
        user_info: req.body,
        profile_picture: imageName,
      });
      const token = generateAuthToken({ ...provider, client: "provider" });

      return res.status(201).json({ provider, token });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/provider/login", async (req, res, next) => {
  try {
    const provider = await ServiceProvider.login(req.body);
    const token = generateAuthToken({ ...provider, client: "provider" });
    return res.status(200).json({ provider, token });
  } catch (err) {
    next(err);
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const { user } = res.locals;
    const providers = await User.fetchProviderByZipCode(user);
    console.log("providers", providers);
    for (const provider of providers) {
      provider.profile_picture = await getImageUrl(provider);
      console.log("provider", provider);
    }
    return res.status(200).json({ providers });
  } catch (err) {
    next(err);
  }
});

router.get("/provider/cuisine", async (req, res, next) => {
  try {
    const providers = await ServiceProvider.fetchProviderByCuisine(req.body);
    return res.status(200).json({ providers });
  } catch (err) {
    next(err);
  }
});

router.get("/provider", async (req, res, next) => {
  try {
    const providers = await ServiceProvider.fetchAllProviders();
    for (const provider of providers) {
      provider.profile_picture = await getImageUrl(provider);
    }
    return res.status(200).json({ providers });
  } catch (err) {
    next(err);
  }
});

router.post("/verify", security.extractUserFromJWT, (req, res, next) => {
  try {
    const { user } = res.locals;
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put(
  "/provider/update",
  security.extractUserFromJWT,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { user } = res.locals;
      const provider = await ServiceProvider.fetchProviderByEmail(user.email)
      const imageName = randomImageName();
      const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      
      const putCommand = new PutObjectCommand(params);
      await s3.send(putCommand);
      updatedProvider = await ServiceProvider.updateHeroAndDescription({
        provider,
        photo: imageName,
        blurb: req.body,
      });

      console.log("updaetdProvider", updatedProvider)
      return res.status(201).json({ updatedProvider });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/user/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.fetchUserById(userId);
    console.log("ahh", user);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/provider/email", async (req, res, next) => {
  try {
    const email = req.body?.email;
    const provider = await ServiceProvider.fetchProviderByEmail(email);
    provider.profile_picture = await getImageUrl(provider);
    if (provider?.service_provider_hero) provider.service_provider_hero = await getHeroImageUrl(provider)
    res.status(200).json({ provider });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
