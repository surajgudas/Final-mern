import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (mobileNumber) {
      setIsLoggedIn(true); // Hide the login modal
    }
  };

  return (
    <div>
      {/* Login Modal */}
      {!isLoggedIn && (
        <div className="login-modal">
          <div className="login-modal-content">
            <h2>Welcome to Paytm</h2>
            <form onSubmit={handleLogin}>
              <label>
                <span>+91</span>
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isLoggedIn && (
        <>
          <header className="paytm-header">
            <h1>Paytm ❤️ UPI</h1>
            <div className="banner">
              <img src="banner.jpg" alt="Refer Friends Banner" />
            </div>
          </header>

          <main className="main-section">
            <div className="upi-info">
              <span>
                UPI Lite: <a href="#">Activate</a>
              </span>
              <span>UPI ID: 7000131XYZ@paytm</span>
            </div>

            <div className="services-grid">
              {[
                "Scan & Pay",
                "To Mobile",
                "Link RuPay Card",
                "To Bank",
                "Balance",
                "Online Offers",
                "Personal Loan",
                "Credit Cards",
                "Win 8000 Points",
                "Flight Tickets",
                "Invest & Trade",
              ].map((service, index) => (
                <div className="service" key={index}>
                  {service}
                </div>
              ))}
            </div>

            <div className="bill-payment">
              <h2>Bill Payment by BBPS</h2>
              <div className="bill-options">
                {["Recharge", "DTH Recharge", "Electricity Bill", "Broadband"].map(
                  (option, index) => (
                    <div className="option" key={index}>
                      {option}
                    </div>
                  )
                )}
              </div>
            </div>
          </main>

          <section className="login-section">
            <h2>Paytm ❤️ UPI</h2>
            <p>
              Get assured <span className="highlight">100 cashback</span> on Paytm
            </p>
            <form>
              <label>
                <span>+91</span>
                <input type="text" placeholder="Enter mobile number" required />
              </label>
              <button type="submit">Proceed</button>
            </form>
          </section>
        </>
      )}
    </div>
  );
};

export default App;
