import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// Header and branding
import logo from '../assets/logo2.png';
import headImage from '../assets/head.png';

// Study Material Cards
import booksImg from '../assets/jee.jpg';
import importantImg from '../assets/neet.jpg';

// Why Choose Us Icons
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';
import icon6 from '../assets/icon6.png';

import whatsappIcon from "../assets/WhatsApp_icon.png";

const Home = () => {
  const navigate = useNavigate();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setMessages([...messages, { sender: "user", text: userMessage }]);
      setUserMessage("");
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "ai", text: "I'm here to help! How can I assist you today?" }]);
      }, 1000);
    }
  };
const handleLearnMore = (courseType) => {
  const user = JSON.parse(localStorage.getItem("registeredUser"));

  if (!user) {
    alert("Please login to access the content.");
    navigate("/login");
    return;
  }

  const registeredCourse = user.courseName?.toLowerCase();
  const requestedCourse = courseType.toLowerCase();

  if (!registeredCourse) {
    alert("Course access not set for your account.");
    navigate("/register");
    return;
  }

  // ✅ MAIN FIX: check if registeredCourse is "both"
  if (
    registeredCourse === requestedCourse ||
    registeredCourse === "both"
  ) {
    navigate(`/${requestedCourse}`);
  } else {
    alert(`❌ Access denied. You are registered for ${user.courseName?.toUpperCase()}.`);
  }
};

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="head">
          <img src={headImage} alt="Header" className="head-image" />
          <div className="head-content">
            <p className="head-text">
              PREPARE STUDENTS TODAY FOR THE CHALLENGES OF TOMORROW
            </p>
            <p className="sub-text">
              A powerful learning app to crack NEET & JEE with expert study material, mock tests, and AI-driven guidance.
            </p>
            <button
              className="course-button"
              onClick={() => document.getElementById("course-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Course
            </button>
          </div>
        </div>
      </div>

      {/* Course Section */}
      <div className="study-materials">
        <h2 id="course-section">Course</h2>
        <div className="tabs-wrapper">
          <button
            className="scroll-left"
            onClick={() => document.getElementById("tabScroll").scrollBy({ left: -300, behavior: "smooth" })}
          >
            &lt;
          </button>

          <div className="tabs-container" id="tabScroll">
            {[{
              title: "JEE Prep Material",
              range: "JEE Exam",
              tags: ["Reference", "Advanced", "Textbooks"],
              img: booksImg,
              courseType: "jee"
            },
            {
              title: "NEET Ready Papers",
              range: "NEET Exam",
              tags: ["Mock Tests", "Practice", "Important"],
              img: importantImg,
              courseType: "neet"
            }].map((card, index) => (
              <div key={index} className="tab-card updated-card">
                <div className="card-header">
                  <span className="class-range">{card.range}</span>
                  <h3>{card.title}</h3>
                </div>
                <div className="tags">
                  {card.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
                <img className="card-image" src={card.img} alt={card.title} />
                <button className="explore-btn" onClick={() => handleLearnMore(card.courseType)}>
                  Learn More
                </button>
              </div>
            ))}
          </div>

          <button
            className="scroll-right"
            onClick={() => document.getElementById("tabScroll").scrollBy({ left: 300, behavior: "smooth" })}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2 className="heading">Why Choose Us</h2>
        <p className="why">
          An AI-powered learning app offering personalized plans, mock tests, analytics, and more.
        </p>
        <div className="circle-layout">
          <div className="center-logo">
            <img src={logo} alt="EduGrow" />
          </div>

          <div className="circle-feature top">
            <img src={icon1} alt="Mobile App" />
            <h4>Mobile App</h4>
            <p>Learn from anywhere at your convenience</p>
          </div>
          <div className="circle-feature top-right">
            <img src={icon2} alt="Intelligent Tutoring System" />
            <h4>Intelligent Tutoring</h4>
            <p>AI provides personalized guidance, just like a human tutor.</p>
          </div>
          <div className="circle-feature bottom-right">
            <img src={icon3} alt="Personalised Learning" />
            <h4>Personalized Learning</h4>
            <p>Pause, rewind, and learn at your pace.</p>
          </div>
          <div className="circle-feature bottom">
            <img src={icon4} alt="Budget Friendly" />
            <h4>Budget Friendly</h4>
            <p>Affordable learning with top-notch quality.</p>
          </div>
          <div className="circle-feature bottom-left">
            <img src={icon5} alt="Mock Test" />
            <h4>Mock Tests</h4>
            <p>Practice real exam-style questions.</p>
          </div>
          <div className="circle-feature top-left">
            <img src={icon6} alt="Support" />
            <h4>24/7 Support</h4>
            <p>Round-the-clock help for all learners.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="faq">
        <h2>Frequently Asked Questions ❓</h2>
        <details>
          <summary>How does AI-learning work?</summary>
          <p>Our AI tracks your progress and provides personalized recommendations.</p>
        </details>
        <details>
          <summary>Are the mock tests similar to actual NEET papers?</summary>
          <p>Yes! Our mock tests are designed to replicate real NEET exams.</p>
        </details>
        <details>
          <summary>Is there a mobile app available?</summary>
          <p>Yes, our mobile app is available on Play Store and App Store.</p>
        </details>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/8248791389"
        className="whatsapp-chat-button"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
        <span>Chat with us on WhatsApp</span>
      </a>

      {/* Chat Button */}
      <div className="ai-status-label" onClick={toggleChat}>
        <span className="ai-icon">🤖</span>
        <span className="ai-text">I'm online 24/7</span>
      </div>

      {/* AI Chat Window */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>AI Bot</h3>
            <button onClick={toggleChat} className="close-chat-btn">X</button>
          </div>
          <div className="chat-body">
            <div className="chat-intro">
              <p>Hi! I'm your AI assistant. How can I help you today?</p>
            </div>
            <div className="messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
