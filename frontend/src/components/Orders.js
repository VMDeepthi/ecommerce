import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import Header from "./Header";
import { Link } from "react-router-dom";
import StarRateIcon from '@mui/icons-material/StarRate';

function Orders() {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const baseURL = "http://localhost:8800";
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  // Define fetchOrders function
  const fetchOrders = async () => {
    try {
      const userId = currentUser?.id;

      if (userId) {
        const response = await axios.get(`${baseURL}/userorders?userId=${userId}`);
        // ?sort=desc
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Call fetchOrders directly inside useEffect
  }, [currentUser?.id]);

  const handleCancelOrder = (orderId) => {
    // Display modal or form for cancellation reason
    setCancellationReason("");
    setSelectedOrderId(orderId);
  };

  const handleCancelReason = () => {
    // Reset states and close the modal or form
    setCancellationReason("");
    setSelectedOrderId(null);
  };

  const handleReturnOrder = (orderId) => {
    // Implement return logic here
    console.log(`Return order with ID ${orderId}`);
  };

  const showConfirmationPopupWithTimeout = () => {
    // Show the confirmation popup
    setShowConfirmationPopup(true);

    // Set a timeout to hide the confirmation popup after 2000 milliseconds (2 seconds)
    setTimeout(() => {
      handleConfirmationPopupClose();
    }, 2000);
  };

  const handleSubmitCancellation = async () => {
    try {
      // Implement cancellation logic here with cancellationReason and selectedOrderId
      console.log(
        `Cancel order with ID ${selectedOrderId} and reason: ${cancellationReason}`
      );

      // Make an API call to update the order status
      await axios.put(`${baseURL}/cancel/${selectedOrderId}`, {
        status: "cancelled",
        cancellationReason: cancellationReason,
      });

      // Fetch updated orders after cancellation
      await fetchOrders(); // Use the fetchOrders function here

      // Reset states after submission
      setCancellationReason("");
      setSelectedOrderId(null);

      // Show the confirmation popup with a timeout
      showConfirmationPopupWithTimeout();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleConfirmationPopupClose = () => {
    // Close the confirmation popup and perform any additional actions if needed
    setShowConfirmationPopup(false);
  };

  return (
    <div>
      <Header />

      <div
        style={{
          padding: "20px",
          width: "100%",

          marginTop: "8%",
        }}
      >
        <h2
          style={{ color: "#005087", paddingBottom: "10px", marginLeft: "45%" }}
        >
          Your Orders
        </h2>
        {orders.length === 0 ? (
          <p>No orders to display</p>
        ) : (
 <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map((order) => (
            <li
              key={order.order_id}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "20px",
              
                boxShadow: "0 20px 40px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
               <Link to={`/productdetails/${order.product_id}`}  style={{textDecoration:"none"}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={`${baseURL}/${order.image_path}`}
                  alt={order.title}
                  style={{
                    maxWidth: "80px",
                    maxHeight: "80px",
                  marginTop:"1%",
                    marginLeft: "5%",
                  }}
                />
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "600",
                      marginLeft: "5%",
                    }}
                  >
                    {order.title}
                  </h3>
                  
                </div>

              </div>
              </Link>
              <div
                style={{
                  fontSize: "14px",
                  color: "#777",
                  marginBottom: "10px",
                  marginLeft: "5%",
                }}
              >
                Status:{" "}
                <span
                  style={{
                    color: order.status === "delivered" ? "#28a745" : "#dc3545",fontWeight:"bold",textTransform: "capitalize" // Capitalize the first letter
                  }}
                >
                  {order.status}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {order.status === "delivering" ? (
                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    style={{
                     
                      borderRadius: "4px",
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "70%",
                      marginTop:"-5%",
                      padding:"20px 20px"
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <Link
                    to={`/Rating/${order.product_id}`}
                    style={{
                      color: "black",
                      textDecoration: "none",
                      cursor: "pointer",
                      marginLeft: "70%",
                      fontWeight:"bold",
                      marginTop:"-8%"
                    }}
                  >
                    <p style={{fontWeight:"400"}}>Your item has been delivered</p>
                    <StarRateIcon style={{color:"gold",marginTop:"-2%"}} />Rate and Review
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
 )}
        {selectedOrderId && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#005087" }}>
                Provide a reason for cancellation
              </h3>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter your reason here..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  marginTop: "10px",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={handleCancelReason}
                  style={{
                    marginRight: "10px",
                    padding: "8px 16px",
                    background: "#ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Close
                </button>
                <button
                  onClick={handleSubmitCancellation}
                  style={{
                    padding: "8px 16px",
                    background: "#005087",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmationPopup && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#28a745" }}>
              Cancellation Submitted Successfully
            </h3>
            <p>Your cancellation request has been successfully submitted.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
