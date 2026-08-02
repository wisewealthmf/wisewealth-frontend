import React from 'react';
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaYoutube,
  FaXTwitter
} from "react-icons/fa6";
import './Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">

    <div className="footer-main">
  
      {/* Logo */}
      <div className="footer-brand">
        <img src={logo} alt="WiseWealth" />
      </div>
  
      {/* Links */}
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/tools">Tools</Link>
        <Link to="/contact">Contact</Link>
      </div>
  
      {/* Socials */}
      <div className="footer-socials">
        <a
          href="https://instagram.com/wisewealth.firm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
  
        <a
          href="https://www.linkedin.com/company/wisewealthfirm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </a>
  
        {/* <a
          href="https://youtube.com/@yourchannel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube />
        </a> */}
      </div>
  
    </div>
  
    <div className="footer-bottom">
      <p>© 2026 WiseWealth. All Rights Reserved.</p>
  
      <p>
        Mutual Fund investments are subject to market risks.
        Read all scheme related documents carefully.
      </p>
    </div>
  
  </footer>
  );
};

export default Footer;

// Made with Bob
