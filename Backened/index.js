require('dotenv').config();
const port = process.env.PORT || 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


//  Middlewares
app.use(express.json());
app.use(cors());

//  Database Connection with MongoDB 
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(" ---------Connected to MongoDB----------"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// ✅ FIXED: Image Storage Engine (only updated this part)
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'upload/images'),  // ✅ Fixed path issue
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});



const upload = multer({ storage: storage });

//  Creating Upload Endpoint for images
app.use('/images', express.static(path.join(__dirname, 'upload/images'))); // ✅ Use absolute path here too

app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});


// Schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true,
  },
})

// Add Product 
app.post('/addproduct', async (req, res) => {
  try {
    const { name, image, category, new_price, old_price } = req.body;

    // Validate input
    if (!name || !image || !category || !new_price || !old_price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let lastProduct = await Product.findOne().sort({ id: -1 });
    let id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: id,
      name,
      image,
      category,
      new_price: Number(new_price),
      old_price: Number(old_price)
    });

    await product.save();
    console.log("✅ Product saved:", product);

    res.json({ success: true, name });
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save product",
      error: error.message
    });
  }
});



// Creating API For deleting Product

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed")
  res.json({
    success: true,
    name: req.body.name,
  })
})

//  Creating API for getting all products
app.get('/allproducts', async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send({ error: "Server Error" });
  }
})

// Schema Creating for user Model 

const Users = mongoose.model('Users', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String
  },
  cartData: {
    type: Object
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {

  let check = await Users.findOne({ email: req.body.email.toLowerCase() });
  if (check) {
    return res.status(400).json({ success: false, errors: "existing user found with the same email" })
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i.toString()] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    cartData: cart,
  })

  await user.save();

  const data = {
    user: {
      id: user.id
    }
  }

  const token = jwt.sign(data, 'secret_ecom');
  res.json({
    success: true,
    token
  })
})

// Creating endpoint for user Login 
app.post('/login', async (req, res) => {
  console.log("Received login data:", req.body)
  let user = await Users.findOne({ email: req.body.email.toLowerCase() });
  console.log("User found in DB:", user)
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      const token = jwt.sign(data, 'secret_ecom');
      res.json({
        success: true,
        token
      })
    }
    else {
      res.json({
        success: false,
        errors: "Wrong Password"
      });

    }
  } else {
    res.json({
      success: false,
      errors: "Wrong Email Id"
    })
  }
})

// Creating endpoint for newcollection data 
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
})

// Creating endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({ category: "women" })
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in Women Fetched");
  res.send(popular_in_women);
})

// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" })
  }
  else {
    try {
      const data = jwt.verify(token, 'secret_ecom')
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using the valid token" })
    }
  }
}


// Creating endpoint for adding products in cartdata
// ✅ Use fetchUser to access req.user
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    const itemId = String(req.body.itemId); // force string key
    console.log("Added", itemId);

    let userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize cartData if missing
    if (!userData.cartData) {
      userData.cartData = {};
    }

    // Initialize the product quantity if it doesn't exist
    if (!userData.cartData[itemId]) {
      userData.cartData[itemId] = 0;
    }

    userData.cartData[itemId] += 1;

    await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });

    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Error in /addtocart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// creating endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    const itemId = String(req.body.itemId);
    console.log("removed", itemId);

    let userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (userData.cartData && userData.cartData[itemId] > 0) {
      userData.cartData[itemId] -= 1;
    }

    await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error in /removefromcart:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// creating endpoint to get cart data 
app.post('/getcart', fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
})


// Start Server
app.listen(port, (error) => {
  if (!error) {
    console.log("-----------Server Running on Port " + port);
  } else {
    console.log("Error :" + error);
  }
});

