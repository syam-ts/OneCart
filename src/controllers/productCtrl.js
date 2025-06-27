const Product = require("../models/productMdl");
const Category = require("../models/categoryMdl");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config(".env");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//<------------ imgage rendering -------------->

/**
 * ! User Prouduct Controller
 **/

//<------------ shopping page -------------->

const getShopping = async (req, res) => {
    try {
        const sortMethod = req.body.sortOption;
        let sortQuery = {};
        switch (sortMethod) {
            case "lowToHigh":
                sortQuery = { price: 1 };
                break;
            case "highToLow":
                sortQuery = { price: -1 };
                break;
            case "nameAce":
                sortQuery = { productName: 1 };
                break;
            case "nameDec":
                sortQuery = { productName: -1 };
                break;
            default:
                sortQuery = {};
        }

        var page = 1;
        const limit = 8;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        const products = await Product.find({ deleted: false })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Product.find({ deleted: false }).countDocuments();
        const categories = await Category.find({ deleted: false });

        res.render("shopping", {
            products: products,
            categories: categories,
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1,
            nextPage: parseInt(page) + 1,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

//<------------ pagination & advanced sort shopping page -------------->
const sortShoppingPage = async (req, res) => {
    try {
        const sortMethod = req.params.method;
        var sortQuery = {};
        switch (sortMethod) {
            case "lowToHigh":
                sortQuery = { price: 1 };
                break;
            case "highToLow":
                sortQuery = { price: -1 };
                break;
            case "aToZ":
                sortQuery = { productName: 1 };
                break;
            case "zToA":
                sortQuery = { productName: -1 };
                break;
            default:
                sortQuery = {};
        }
        var page = 1;
        const limit = 8;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        const products = await Product.find({ deleted: false })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sortQuery)
            .exec();

        const count = await Product.find({ deleted: false }).countDocuments();
        const categories = await Category.find({ deleted: false });
        res.render("shopping", {
            products: products,
            categories: categories,
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page > 1 ? page - 1 : 1,
            nextPage:
                page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit),
        });
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ product details -------------->
const productDetails = async (req, res) => {
    try {
        const productId = req.params.id;
        const products = await Product.findById(productId);
        const user = req.session.user;
        const category = products.category;
        const relatedProducts = await Product.find({ category: { $in: category } });
        res.render("product", { datas: [products, user, relatedProducts] });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server internal Error");
    }
};

//<------------ search products -------------->
const searchProduct = async (req, res) => {
    try {
        const limit = 4,
            input = req.query.searchTerm;
        const product = await Product.find({
            productName: { $regex: `.*${input}.*`, $options: "i" },
        }).limit(limit);
        const total = await Product.countDocuments({
            productName: { $regex: `.*${input}.*`, $options: "i" },
        });
        const totalProduct = Math.ceil(total / limit);
        res.render("search", { product, totalProduct });
    } catch (error) {
        res.render("error", { message: "Product Not Found" });
    }
};

//<------------ advanced search  -------------->
const getLowToHigh = async (req, res) => {
    try {
        const limit = 4;
        const input = req.params.id;
        const category = await Product.findOne({ category: input });
        const total = await Product.find({ category: input }).count();
        const totalProduct = total / 4;
        const products = await Product.find({ category: input })
            .sort({ price: 1 })
            .limit(limit);
        res.render("search", {
            products,
            category: category.category,
            totalProduct,
        });
    } catch (error) {
        console.log(error.message);
    }
};

/**
 * ! Admin Prouduct Controller
 * */
//<------------ product listing -------------->
const productList = async (req, res) => {
    try {
        const originalUrl = req.originalUrl;
        var page = 1;
        const limit = 8;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        const products = await Product.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Product.find().countDocuments();
        res.render("product-list", {
            products: products,
            originalUrl: originalUrl,
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page > 1 ? page - 1 : 1,
            nextPage:
                page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit),
            toastMessage: { type: "success", text: "" },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server internal Error");
    }
};
//<------------ proudct sort with pagination -------------->
const sortProductAdmin = async (req, res) => {
    try {
        const originalUrl = req.query.returnUrl,
            sortMethod = req.params.method;
        var sortQuery = {};
        switch (sortMethod) {
            case "recentProducts":
                sortQuery = { createdate: -1 };
                break;
            case "olderProducts":
                sortQuery = { createdate: 1 };
                break;
            default:
                sortQuery = {};
        }
        if (sortMethod == "blockedProducts") {
            var page = 1;
            const limit = 8;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
            const products = await Product.find({ deleted: true })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            const count = await Product.find({ deleted: true }).countDocuments();
            res.render("product-list", {
                products: products,
                originalUrl,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage:
                    page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit),
            });
        } else if (sortMethod == "unBlockedProducts") {
            var page = 1;
            const limit = 8;
            if (req.query.page) {
                page = parseInt(req.query.page);
            }
            const products = await Product.find({ deleted: false })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            const count = await Product.find({ deleted: false }).countDocuments();
            res.render("product-list", {
                products: products,
                originalUrl,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page > 1 ? page - 1 : 1,
                nextPage:
                    page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit),
            });
        }
        var page = 1;
        const limit = 8;
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        const products = await Product.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sortQuery)
            .exec();

        const count = await Product.find().countDocuments();
        res.render("product-list", {
            products: products,
            originalUrl,
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page > 1 ? page - 1 : 1,
            nextPage:
                page < Math.ceil(count / limit) ? page + 1 : Math.ceil(count / limit),
        });
    } catch (error) {
        console.log(error.message);
    }
};

//<------------ proudct add page load -------------->
const ProductAdd = async (req, res) => {
    const categories = await Category.find({ deleted: false });
    try {
        res.render("product-add", { categories });
    } catch (error) {
        res.send(error.message);
    }
};

//<------------ adding new product -------------->
const insertProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.redirect(
                "/admin/product-add?message=No image uploaded&type=error"
            );
        }
        const { price, description, size, stock } = req.body;
        const productImage = req.file.path;

        const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
        const extension = productImage.split(".").pop().toLowerCase();
        const allExtensionsAllowed = allowedExtensions.includes(extension);

        if (!allExtensionsAllowed) {
            return res.redirect(
                "/admin/product-add?message=Invalid image format&type=error"
            );
        } else if (description.length < 20) {
            res.redirect(
                "/admin/product-add?message=Description should have atleast 20 words&type=error"
            );
        } else if (price < 300 || price > 40000) {
            res.redirect(
                "/admin/product-add?message=The price should be between 300 and 40000&type=error"
            );
        } else if (size < 4 || size > 42) {
            res.redirect(
                "/admin/product-add?message=The size should be between 4 and 42&type=error"
            );
        } else if (stock < 1 || stock > 1000) {
            res.redirect(
                "/admin/product-add?message=The stock should be between 1 and 1000&type=error"
            );
        } else {
            const { productName, category, brand, color, size, stock } = req.body;
            const product = new Product({
                productName: productName,
                productImage: productImage,
                category: category,
                description: description,
                brand: brand,
                color: color,
                price: price,
                size: size,
                stock: stock,
            });
            await product.save();
            res.redirect(
                "/admin/sortProductAdmin/recentProducts?message=New product created&type=success"
            );
        }
    } catch (err) {
        console.log("ERROR: ", err);
        res.render("error", { message: err });
    }
};

//<------------ load product edit -------------->
const getProductEdit = async (req, res) => {
    try {
        const id = req.params.id,
            originalUrl = req.query.returnUrl;
        const categories = await Category.find({ deleted: false });
        const products = await Product.findById(id);
        if (!products) {
            return res.status(404).send("Product not found");
        }
        res.render("product-edit", {
            products: [products, categories],
            originalUrl,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

//<------------ update product || edit product -------------->
const postProductEdit = async (req, res) => {
    try {
     
        const {
            productName,
            category,
            description,
            brand,
            color,
            price,
            size,
            stock,
            extras,
        } = req.body;
        const returnUrl = req.query.returnUrl;
 

    let productImage;

        if (req.file && req.file.filename) {
            productImage = req.file.path;
        } else { 
            productImage = req.body.existingImage;
        }

        const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
        const extension = productImage.split(".").pop().toLowerCase();
        const allExtensionsAllowed = allowedExtensions.includes(extension);

        if (!allExtensionsAllowed) {
            return res.redirect(
                "/admin/product-edit/${req.params.id}?message=Invalid image format&type=error"
            );
        } else if (description.length < 20) {
            res.redirect(
                `/admin/product-edit/${req.params.id}?message=Description should have atleast 20 words&type=error`
            );
        } else if (price < 300 || price > 40000) {
            res.redirect(
                `/admin/product-edit/${req.params.id}?message=The price should be between 300 and 40000&type=error`
            );
        } else if (size < 4 || size > 42) {
            res.redirect(
                `/admin/product-edit/${req.params.id}?message=The size should be between 4 and 42&type=error`
            );
        } else if (stock < 1 || stock > 1000) {
            res.redirect(
                `/admin/product-edit/${req.params.id}?message=The stock should be between 1 and 1000&type=error`
            );
        } else {
            const productId = req.params.id;
            let product = await Product.findById(productId);
            if (!product) {
                return res.render(
                    "product-list?message=New Address added&type=success"
                );
            }
            product.productImage = productImage;
            product.productName = productName;
            product.category = category;
            product.description = description;
            product.brand = brand;
            product.stock = stock;
            product.color = color;
            product.price = price;
            product.size = size;
            product.extras = extras;
            product = await product.save();
            return res.redirect(`/admin/sortProductAdmin/recentProducts?page=1`);

            // return res.redirect(
            //     `${returnUrl}${returnUrl.includes("?") ? "&" : "?"
            //     }message=Product Updated&type=success`
            // );
        }
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send(`Internal Server Error  ${error}`);
    }
};

//<------------ product soft delete -------------->
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id,
            returnUrl = req.query.returnUrl;
        const product = await Product.findById(id);
        if (product.deleted == false) {
            product.deleted = true;
            await product.save();
            res.redirect(
                `${returnUrl}${returnUrl.includes("?") ? "&" : "?"
                }message=Product%20Unlisted&type=success`
            );
        } else if (product.deleted == true) {
            product.deleted = false;
            await product.save();
            return res.redirect(
                `${returnUrl}${returnUrl.includes("?") ? "&" : "?"
                }message=Product Listed&type=success`
            );
        } else {
            return res.status(404).send("prouduct not found");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error");
    }
};

module.exports = {
    getShopping,
    sortShoppingPage,
    productDetails,
    productList,
    sortProductAdmin,
    ProductAdd,
    insertProduct,
    getProductEdit,
    postProductEdit,
    deleteProduct,
    searchProduct,
    getLowToHigh,
};
