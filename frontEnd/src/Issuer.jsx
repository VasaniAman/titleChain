import React, { useEffect, useState, useRef, useContext } from 'react';
import AOS from 'aos';
import './css/custom.css';
import './css/bootstrap.min.css';
import './font-awesome-4.7.0/css/font-awesome.min.css';

import { Link } from "react-router-dom";
import axios from 'axios';

import './css/aos.css';

/*
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import './css/custom.css';
import './css/bootstrap.min.css';
import './font-awesome-4.7.0/css/font-awesome.min.css';

import { Link } from 'react-router-dom';
import axios from 'axios';

import './css/aos.css';
*/

const Issuer = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const fileInputRef = useRef(null);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          setEmail(res.data.email);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);        

  const handleDelete = () => {
    axios.get('http://localhost:8081/logout')
      .then(res => {
        //window.location.reload(true);
      }).catch(err => console.log(err));
  }

  useEffect(() => {
    AOS.init();
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadStatus(null);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('issuerName', name);
      formData.append('issuerEmail', email); // Pass the email state
  
      axios.post('http://localhost:8081/upload', formData)
        .then(res => {
          const filePath = res.data.filePath;
          if (filePath) {
            setUploadStatus('success');
            setSelectedFile(null);
            setTimeout(() => {
              setUploadStatus(null);
              window.location.reload();
            }, 4000);
          } else {
            setUploadStatus('error');
          }
        })
        .catch(err => {
          setUploadStatus('error');
          console.log(err);
        });
    } else {
      setUploadStatus('error');
    }
  };  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {auth ?
        <div>
          <div className="jumbotron jumbotron-fluid" id="banner1" style={{ backgroundImage: `url("https://t4.ftcdn.net/jpg/04/91/04/57/360_F_491045782_57jOG41DcPq4BxRwYqzLrhsddudrq2MM.jpg")` }}>
            <div className="container text-center text-md-left">
              <header>
                <div className="row justify-content-right">
                  <div className="col-6 align-self-center text-right">
                    <Link to="/" onClick={handleDelete} className="text-white lead" id="logout">Logout</Link>
                  </div>
                </div>
              </header>
              <img src={require('./newnewlogo.png')} alt="logo" id="logo"></img>
              <h3 id="title"> TitleChain</h3>
            </div>
          </div>

          <div className="container my-5 py-2">
            <h2 id="name" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">Welcome Issuer: {name} </h2>
          </div>

          {/* File Upload */}
          <div className="container my-5">
            {uploadStatus === 'success' && (
              <div className="alert alert-success" role="alert">
                File uploaded successfully!
                *The page will refresh after 4 seconds. You can upload another file after refresh.
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="alert alert-danger" role="alert">
                {selectedFile ? 'Failed to upload the file.' : 'Please select a file to upload.'}
              </div>
            )}
            <h2 data-aos="fade" data-aos-easing="linear" data-aos-delay="300" data-aos-once="true">Upload Document</h2>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <input
                  data-aos="fade" data-aos-easing="linear" data-aos-delay="350" data-aos-once="true"
                  id="input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <button data-aos="fade" data-aos-easing="linear" data-aos-delay="350" data-aos-once="true" id='inputBtn' className="btn btn-primary" onClick={handleFileUpload}>Upload</button>
              </div>
            </div>
          </div>

          <div className="jumbotron jumbotron-fluid" id="contact" style={{ backgroundImage: `url("https://images.squarespace-cdn.com/content/v1/62e74388ac41fd3cd162d1d2/1661329062631-EKRMKOOK91UPZSSYGWGZ/Background.png?format=2500w")` }}>
            <div className="container my-5">
              <div className="row justify-content-between">
                <div className="col-md-6 text-white">
                  <h2 className="font-weight-bold">Contact Us</h2>
                  <p className="my-4">
                    Come find us below,
                    <br /> Thank you for your support!
                  </p>
                  <ul className="list-unstyled">
                    <li>Email: jsehmi246@gmail.com, amanvasani@gmail.com</li>
                    <li>Phone: 361-688-5824</li>
                    <li>Address: Nairobi, Kenya</li>
                  </ul>
                </div>
                <div className="col-md-6"></div>
              </div>
            </div>
          </div>

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
        </div>
        :
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login-page" className="link-btn3">Login</Link>
        </div>
      }
    </div>
  );
};

export default Issuer;