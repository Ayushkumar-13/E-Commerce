import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 1; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [all_product, setAll_Product] = useState([]);

    useEffect(() => {
        fetch("https://e-commerce-418v.vercel.app/allproducts")
            .then((response) => response.json())
            .then((data) => setAll_Product(data))
            .catch((err) => {
                console.error("Failed to fetch products:", err);
            });
        if (localStorage.getItem('token')) {
            fetch('https://e-commerce-418v.vercel.app/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'token': `${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            }).then((response) => response.json())
                .then((data) => setCartItems(data))
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        console.log("Item added to cart:", itemId);

        const token = localStorage.getItem("token");
        console.log("Sending token in header:", token);

        if (token) {
            fetch("https://e-commerce-418v.vercel.app/addtocart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    token: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(errorText);
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Backend response:", data);
                })
                .catch((err) => {
                    console.error("Error:", err.message);
                });
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1,
        }));

        if (localStorage.getItem("token")) {
            fetch("https://e-commerce-418v.vercel.app/removefromcart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    token: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find(
                    (product) => product.id === Number(item)
                );
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
