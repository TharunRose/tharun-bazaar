import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";

import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const Home = () => {
  const user = auth.currentUser;

  const [productData, setProductData] = useState([
    { productId: 1, productName: "Tomato", productPrice: 30 },
    { productId: 2, productName: "Potato", productPrice: 50 },
    { productId: 3, productName: "Orange", productPrice: 90 },
    { productId: 4, productName: "Apple", productPrice: 150 },
  ]);
  const [order, setOrder] = useState({
    customerName: "",
    customerPhoneNumber: "",
    paymentType: "",
    products: [],
  });

  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const productList = productData.map((product) => ({
      ...product,
      quantity: 0,
    }));
    setProductData(productList);
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedProducts = productData.map((product) => {
      if (product.productId === productId) {
        const totalAmount = quantity * product.productPrice;
        return {
          ...product,
          quantity,
          totalAmount,
          productName: product.productName, // ✅ Ensure productName is included
        };
      }
      return product;
    });

    setProductData(updatedProducts);

    const selectedProducts = updatedProducts
      .filter((product) => product.quantity > 0)
      .map((product) => ({
        product_id: product.productId,
        quantity: product.quantity,
        productName: product.productName, // ✅ Ensure productName is included
        totalAmount: product.totalAmount,
        customerName: order.customerName,
        customerPhoneNumber: order.customerPhoneNumber,
        paymentType: order.paymentType,
        user_id: user.uid,
      }));

    setOrder((prevOrder) => ({ ...prevOrder, products: selectedProducts }));
  };

  const handleOrderSave = async () => {
    if (
      !order.customerName ||
      !order.customerPhoneNumber ||
      !order.paymentType
    ) {
      alert("Customer Name, Phone Number, and Payment Type cannot be empty.");
      return;
    }

    if (order.products.length <= 0) {
      alert("Select products");
      return;
    }

    try {
      const user = auth.currentUser; // Get current logged-in user

      if (!user) {
        alert("User not logged in!");
        return;
      }

      const orderData = {
        customerName: order.customerName,
        customerPhoneNumber: order.customerPhoneNumber,
        paymentType: order.paymentType,
        products: order.products,
        userId: user.uid, // Store user ID
        timestamp: new Date(), // Add timestamp
        status: "Active",
      };

      // Save order in Firestore
      await addDoc(collection(db, "orders"), orderData);

      alert("Order placed successfully!");

      clearForm();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to place order. Try again.");
    }
  };

  const clearForm = () => {
    setOrder({
      customerName: "",
      customerPhoneNumber: "",
      paymentType: "",
      products: [],
    });
    getProducts();
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Tharun Bazaar</h1>

      <div className={styles.from}>
        <label>Customer Name</label>
        <input
          type="text"
          placeholder="Enter Customer Name"
          value={order.customerName}
          onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
        />

        <label>Customer Phone Number</label>
        <input
          type="number"
          placeholder="Enter Customer Phone Number"
          value={order.customerPhoneNumber}
          onChange={(e) =>
            setOrder({ ...order, customerPhoneNumber: e.target.value })
          }
        />

        <button
          className={styles.toggleButton}
          onClick={() => setShowProducts(!showProducts)}
        >
          {showProducts ? "Hide Products" : "Show Products"}
        </button>

        {showProducts && (
          <div className={styles.productList}>
            {productData && productData.length > 0 ? (
              <>
                {productData.map((product) => (
                  <div key={product.productId} className={styles.product}>
                    <div className={styles.productHeader}>
                      <span className={styles.productName}>
                        {product.productName} - Rs: {product.productPrice}
                      </span>
                    </div>
                    <div className={styles.productInputs}>
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="0"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.productId,
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <p className={styles.totalPrice}>
                        Total: Rs {product.totalAmount || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>No More Products</p>
            )}
          </div>
        )}

        <label>Payment Type</label>
        <select
          name=""
          id=""
          value={order.paymentType}
          onChange={(e) => setOrder({ ...order, paymentType: e.target.value })}
        >
          <option value="select">Select</option>
          <option value="cash">Cash</option>
        </select>

        <button className={styles.toggleButton} onClick={handleOrderSave}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Home;
