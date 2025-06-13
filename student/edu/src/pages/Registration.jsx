import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Registration.css";
import registerIllustration from "../assets/registerillustration.jpg";
import whatsappIcon from "../assets/WhatsApp_icon.png";

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);

  // Step 1 states
  const [firstname, setUsername] = useState("");
  const [lastname, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  

  // Step 2 states
  const [photo, setPhoto] = useState(null);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");

  // Step 3 states
  const [selectedPlan, setSelectedPlan] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

 const handleStepOneSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return setEmailError("Please enter a valid email address.");
    else setEmailError("");
    if (!validateMobile(mobile)) return setMobileError("Please enter a valid 10-digit mobile number.");
    else setMobileError("");
    if (password !== confirmPassword) return alert("Passwords do not match!");
    localStorage.setItem("registeredUser", JSON.stringify({ firstname, lastname, email, mobile, password }));
    setStep(2);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!photo || !dob || !gender || !selectedCourse) return alert("Please fill in all required fields.");
    if ((selectedCourse === "JEE" || selectedCourse === "NEET") && !selectedStandard) return alert("Please select your standard (11th or 12th).");
    const updatedUser = JSON.parse(localStorage.getItem("registeredUser"));
    updatedUser.dob = dob;
    updatedUser.gender = gender;
    updatedUser.course = selectedCourse;
    updatedUser.standard = selectedStandard;
    updatedUser.role = selectedCourse.toLowerCase();
    localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
    setStep(3);
  };

 const completePayment = (method) => {
    setPaymentMethod(method);
  };

  const handlePayNowClick = () => {
    if (!selectedPlan) return alert("Please select a plan.");
    setShowPaymentOptions(true);
  };

  const handleFinalPayment = () => {
    if (paymentMethod === "UPI" && !upiId) return alert("Enter UPI ID");
    if (paymentMethod === "Net Banking" && !bank) return alert("Select a bank");
    if (paymentMethod === "Credit/Debit Card" && (!cardNumber || !expiry || !cvv)) return alert("Fill all card details");

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      alert(`Payment successful using ${paymentMethod}`);
      const user = JSON.parse(localStorage.getItem("registeredUser"));
      alert(`Login successful! Welcome ${user.firstname}`);
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="registration-container">
      <div className="registration-illustration">
        <img src={registerIllustration} alt="Register Illustration" />
        <h1>Welcome to Our Platform</h1>
        <p>Join us to explore amazing features and opportunities!</p>
      </div>

      <div className="registration">
        {step === 1 && (
          <>
          
            <h2>Register Now</h2>
            <div className="Register-form-box">
              <form onSubmit={handleStepOneSubmit}>
                <div className="name-container">
                  <input type="text" placeholder="Student First Name" value={firstname} onChange={(e) => setUsername(e.target.value)} required className="half-width" />
                  <input type="text" placeholder="Student Last Name" value={lastname} onChange={(e) => setStudentName(e.target.value)} required className="half-width" />
                </div>

                <input type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} required />
                {emailError && <span className="error-message">{emailError}</span>}

                <input type="tel" placeholder="Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                {mobileError && <span className="error-message">{mobileError}</span>}

                <div className="password-container">
                  <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="password-input" />
                  <span className="icon inside" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁" : "🙈"}</span>
                </div>

                <div className="password-container">
                  <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="password-input" />
                  <span className="icon inside" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁" : "🙈"}</span>
                </div>

                <div className="form-actions">
                  <div className="checkbox-container">
                    <input type="checkbox" id="agree" required />
                    <label htmlFor="agree">
                      I have agreed to the <Link to="/terms" className="footer-link">Terms and Conditions</Link>
                    </label>
                  </div>

                  <button type="submit">Next</button>

                  <p className="login-text">
                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Login</a>
                  </p>
                </div>
              </form>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="student-details">
            <h2>Student Details</h2>
          <div className="student-details-wrapper">
            
            <div className="left-section">
              <p className="upload-text">Upload Profile Picture *</p>
              <label htmlFor="file-input" className="custom-upload">
                {photo ? <img src={photo} alt="Profile" className="profile-preview" /> : <span className="upload-placeholder">+</span>}
              </label>
              <input id="file-input" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden-input" />
            </div>

            <div className="right-section">
              <form onSubmit={handleFinalSubmit}>
                
                <input  type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />

                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                  <option value="">Course</option>
                  <option value="kid">Kindergarten</option>
                  <option value="first">Class 1-5</option>
                  <option value="six">Class 6-12</option>
                  <option value="JEE">JEE</option>
                  <option value="NEET">NEET</option>
                  <option value="Other">Other</option>
                </select>

                {(selectedCourse === "first" || selectedCourse === "six" || selectedCourse === "JEE" || selectedCourse === "NEET") && (
                  <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} required>
                    <option value="">Select Standard</option>
                    {selectedCourse === "first" && [1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
                    {selectedCourse === "six" && [6,7,8,9,10,11,12].map(n => <option key={n}>{n}</option>)}
                    {(selectedCourse === "JEE" || selectedCourse === "NEET") && ["11th", "12th"].map(std => <option key={std}>{std}</option>)}
                  </select>
                )}

                <div className="student-navigation-buttons">
                  <button onClick={() => setStep(1)}>Previous</button>
<button type="submit">Next</button>
                </div>

              </form>
            </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="payment-section">
          <h2>Select Your Plan</h2>
          <div className="payment-selection">
            

            <div className="plans">
              <label><input type="radio" name="plan" value="trial" checked={selectedPlan === "trial"} onChange={() => setSelectedPlan("trial")} /> 15-day Free Trial</label>
              <label><input type="radio" name="plan" value="monthly" checked={selectedPlan === "monthly"} onChange={() => setSelectedPlan("monthly")} /> 1 Month – ₹1000</label>
              <label><input type="radio" name="plan" value="yearly" checked={selectedPlan === "yearly"} onChange={() => setSelectedPlan("yearly")} /> 1 Year – ₹12000</label>
            </div>

            <div className="promo-section">
              <input type="text" placeholder="Enter Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button onClick={() => alert("Promo Applied: " + promoCode)}>Apply</button>
            </div>
{showPaymentOptions && (
              <div className="payment-options-modal">
                <h3>Select Payment Method</h3>
                <div className="methods">
                  <button onClick={() => completePayment("Google Pay")}>Google Pay</button>
                  <button onClick={() => completePayment("PhonePe")}>PhonePe</button>
                  <button onClick={() => completePayment("Paytm")}>Paytm</button>
                 <button onClick={() => setPaymentMethod("UPI")}>UPI</button>
            <button onClick={() => setPaymentMethod("Net Banking")}>Net Banking</button>
            <button onClick={() => setPaymentMethod("Credit/Debit Card")}>Credit/Debit Card</button>
                </div>
                          {paymentMethod === "UPI" && (
            <div>
              <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            </div>
          )}

          {paymentMethod === "Net Banking" && (
            <div>
              <select value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="">-- Select Bank --</option>
                <option value="SBI">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Axis">Axis Bank</option>
              </select>
            </div>
          )}

          {paymentMethod === "Credit/Debit Card" && (
            <div>
              <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              <input type="month" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              <input type="password" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={3} />
            </div>
          )}

          {paymentMethod && (
            <button onClick={handleFinalPayment} disabled={isPaying}>
              {isPaying ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>
            )}
            <div className="plans-navigation-buttons">
              <button onClick={() => setStep(2)}>Previous</button>
              <button onClick={() => {
                if (!selectedPlan) return alert("Please select a plan.");
                setShowPaymentOptions(true);
              }}>
                Pay Now
              </button>
            </div>

            
          </div>
          </div>
        )}
      </div>

      <a href="https://wa.me/YOUR_PHONE_NUMBER" className="whatsapp-chat-button" target="_blank" rel="noopener noreferrer">
        <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
        <span>Chat with us on WhatsApp</span>
      </a>
    </div>
  );
};

export default RegistrationFlow;