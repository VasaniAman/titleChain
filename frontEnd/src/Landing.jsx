import React, { useEffect } from 'react';
import AOS from 'aos';
import './css/custom.css';
import './css/bootstrap.min.css';
import './font-awesome-4.7.0/css/font-awesome.min.css';

import { Link } from "react-router-dom";
import axios from 'axios';


import './css/aos.css';

const Landing = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
    
      <div className="jumbotron jumbotron-fluid" id="banner" style={{ backgroundImage: `url("https://t4.ftcdn.net/jpg/04/91/04/57/360_F_491045782_57jOG41DcPq4BxRwYqzLrhsddudrq2MM.jpg")`  }}>
        <div className="container text-center text-md-left">
          <header>
            <div className="row justify-content-between">
              <div className="col-2">
               
              </div>
              <div className="col-6 align-self-center text-right">
               <Link to="/login" className="text-white lead">Login</Link>
              </div>
            </div>
          </header>
          <h1 data-aos="fade" data-aos-easing="linear" data-aos-duration="1000" data-aos-once="false" className="display-4 text-white font-weight-bold my-3">
           TitleChain: <br></br>
           Title Deeds with Blockchain 
          </h1>
          <p data-aos="fade" data-aos-easing="linear" data-aos-duration="1000" data-aos-once="false" className="lead text-white my-4">
            Celebrate hassle-free property ownership with TtileChain. Our cutting-edge blockchain app simplifies title deed management, 
            ensuring security, transparency, and efficiency.
            <br />Say goodbye to cumbersome paperwork and hello to a streamlined, trustworthy solution. Experience the future of property transactions with TitleChain.
          </p>
        </div>
      </div>
      {/* three-block */}
      <div className="container my-5 py-2">
        <h2 className="text-center font-weight-bold my-5">What TitleChain Offers: </h2>
        <div className="row">
          <div data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000" data-aos-once="false" className="col-md-4 text-center">
             <img src={require('./smart-protect-1.jpg')} className="mx-auto" />
            <h4>Secure Title Deeds</h4>
            <p className="text-left">TitleChain leverages blockchain technology to create immutable title deeds.  <br></br><br></br>This ensures that once a title deed is recorded on the blockchain,
               it cannot be altered or tampered with, providing a trusted record of ownership.</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000" data-aos-once="false" className="col-md-4 text-center">
            <img src={require('./smart-protect-2.jpg')} alt="Phishing Detect" className="mx-auto" />
            <h4>Transparent Ownership History</h4>
            <p  className="text-left">With TitleChain, users can easily access the ownership history of a property. <br></br><br></br> The blockchain records all previous transactions,
               enabling transparent and traceable ownership information, which enhances trust and reduces disputes.a</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000" data-aos-once="false" className="col-md-4 text-center">
            <img src={require('./smart-protect-3.jpg')} alt="Smart Scan" className="mx-auto" />
            <h4>Secure Data Storage</h4>
            <p  className="text-left">TitleChain employs encryption and decentralized storage for security. <br></br><br></br> Property-related documents and sensitive information are securely stored on the blockchain,
                reducing the risk of unauthorized access or data loss..</p>
          </div>
        </div>
      </div>
      {/* feature (skew background) */}
      <div className="jumbotron jumbotron-fluid feature" id="feature-first">
        <div className="container my-5">
          <div className="row justify-content-between text-center text-md-left">
            <div data-aos="fade-right" data-aos-duration="1000" data-aos-once="false" className="col-md-6">
              <h2 className="font-weight-bold">What we Feature</h2>
              <p className="my-4">Our main feature is our unique Signature Function,
                <br /> This ensures that your Title Deed will always remain secure with us.</p>
             
            </div>
            <div data-aos="fade-left" data-aos-duration="1000" data-aos-once="false" className="col-md-6 align-self-center">
               <img src={require('./signature.png')} alt="Take a look inside" className="mx-auto d-block" />
            </div>
          </div>
        </div>
      </div>
      {/* feature (green background) */}
      <div className="jumbotron jumbotron-fluid feature" id="feature-last">
        <div className="container">
          <div className="row justify-content-between text-center text-md-left">
            <div data-aos="fade-left" data-aos-duration="1000" data-aos-once="false" className="col-md-6 flex-md-last">
              <h2 className="font-weight-bold">Safety and Reliability</h2>
              <p className="my-4">
                With our state of the art encryption,
                <br /> we ensure saftey in every step that we take.
              </p>
              
              <Link to="/register" className="btn my-4 font-weight-bold atlas-cta cta-blue">Sign Up</Link>
            </div>
            <div data-aos="fade-right" data-aos-duration="1000" data-aos-once="false" className="col-md-6 align-self-center flex-md-first">
             <img src={require('./feature-2.png')} alt="Safe and reliable" className="mx-auto d-block" />
            </div>
          </div>
        </div>
      </div>

      {/* client */}
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <div className="row">
            <div className="col-sm-4 col-md-2 py-2 align-self-center">
              <img src={require('./client-1.png')} className="mx-auto d-block" alt="client" />
            </div>
            <div className="col-sm-4 col-md-2 py-2 align-self-center">
              <img src={require('./client-2.png')} className="mx-auto d-block" alt="client" />
            </div>
            <div className="col-sm-4 col-md-2 py-2 align-self-center">
              <img src={require('./client-3.png')} className="mx-auto d-block" alt="client" />
            </div>
            <div className="col-sm-4 col-md-2 py-2 align-self-center">
              <img src={require('./client-4.png')} className="mx-auto d-block" alt="client" />
            </div>
            <div className="col-sm-4 col-md-2 py-2 align-self-center">
              <img src={require('./client-5.png')} className="mx-auto d-block" alt="client" />
            </div>
            <div className="col-sm-4 col-md-2 py-2 align-self-center">
              <img src={require('./client-6.png')} className="mx-auto d-block" alt="client" />
            </div>
          </div>
        </div>
      </div>
      {/* contact */}
      <div className="jumbotron jumbotron-fluid" id="contact" style={{ backgroundImage: `url("https://images.squarespace-cdn.com/content/v1/62e74388ac41fd3cd162d1d2/1661329062631-EKRMKOOK91UPZSSYGWGZ/Background.png?format=2500w")`  }}>
        <div className="container my-5">
          <div className="row justify-content-between">
            <div className="col-md-6 text-white">
              <h2 className="font-weight-bold">Contact Us</h2>
              <p className="my-4">
                Come find us below,
                <br /> Thank you for your support!
              </p>
              <ul className="list-unstyled">
                <li>Email : jsehmi246@gmail.com, amanvasani@gmail.com</li>
                <li>Phone : 361-688-5824</li>
                <li>Address : Nairobi, Kenya</li>
              </ul>
               
            </div>
            <div className="col-md-6">
             
            </div>
          </div>
        </div>
      </div>
      {/* copyright */}
      <div className="jumbotron jumbotron-fluid" id="copyright">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-6 text-white align-self-center text-center text-md-left my-2">
              &copy; Singh Sehmi 146254, Vasani Aman 144914.
            </div>
            <div className="col-md-6 align-self-center text-center text-md-right my-2" id="social-media">
              <a href="#" className="d-inline-block text-center ml-2">
                <i className="fa fa-facebook" aria-hidden="true" />
              </a>
              <a href="#" className="d-inline-block text-center ml-2">
                <i className="fa fa-twitter" aria-hidden="true" />
              </a>
              <a href="#" className="d-inline-block text-center ml-2">
                <i className="fa fa-medium" aria-hidden="true" />
              </a>
              <a href="#" className="d-inline-block text-center ml-2">
                <i className="fa fa-linkedin" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;