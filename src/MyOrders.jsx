import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchOrders(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "Cancelled" });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  if (loading) {
    return <p style={styles.loading}>Loading orders...</p>;
  }

  if (!user) {
    return <p style={styles.error}>Error: User is null. Please log in.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Orders</h2>
      {orders.length === 0 ? (
        <p style={styles.noOrders}>No orders found</p>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <h3 style={styles.orderTitle}>Order ID: {order.id}</h3>
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.customerPhoneNumber}</p>
              <p><strong>Payment:</strong> {order.paymentType}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div style={styles.products}>
                <h4 style={styles.productTitle}>Products:</h4>
                <ul style={styles.productList}>
                  {order.products.map((product, index) => (
                    <li key={index} style={styles.productItem}>
                      <span>{product.productName}</span> -
                      <strong> Qty: {product.quantity}</strong>,
                      <strong> ₹{product.totalAmount}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              {order.status !== "Cancelled" && (
                <button style={styles.cancelButton} onClick={() => cancelOrder(order.id)}>
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "auto",
    marginTop: "100px",
    padding: "20px",
    background: "#f4f4f4",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#007BFF",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontSize: "16px",
  },
  noOrders: {
    textAlign: "center",
    color: "gray",
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  orderCard: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    borderLeft: "5px solid #007BFF",
  },
  orderTitle: {
    color: "#007BFF",
    marginBottom: "10px",
  },
  products: {
    marginTop: "10px",
  },
  productTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  productList: {
    listStyle: "none",
    paddingLeft: "0px",
  },
  productItem: {
    background: "#f9f9f9",
    padding: "8px",
    borderRadius: "5px",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
  },
  cancelButton: {
    background: "red",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default MyOrders;
