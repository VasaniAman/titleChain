import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import './css/custom.css';
import './css/bootstrap.min.css';
import './font-awesome-4.7.0/css/font-awesome.min.css';

import { Link } from 'react-router-dom';
import axios from 'axios';

import './css/aos.css';

const Verifier = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [unverifiedUploads, setUnverifiedUploads] = useState([]);
  const [verifiedUploads, setVerifiedUploads] = useState([]);
  const [loadingFile, setLoadingFile] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get('http://localhost:8081')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setAuth(true);
          setName(res.data.name);
          setEmail(res.data.email);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8081/getFileData')
      .then((res) => {
        if (res.data.Status === 'Success') {
          const fileData = res.data.fileData;
          const unverifiedUploads = fileData.filter((data) => !data.verified);
          setUnverifiedUploads(unverifiedUploads);
        } else {
          console.error('Error fetching file data:', res.data.error);
        }
      })
      .catch((err) => {
        console.error('Error fetching file data:', err);
      })
      .finally(() => {
        setLoadingFile(false);
      });
  }, []);

  const handleDelete = () => {
    axios
      .get('http://localhost:8081/logout')
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get('http://localhost:8081/getVerifiedUploads')
      .then((res) => {
        if (res.data.Status === 'Success') {
          const fileData = res.data.uploads;
          setVerifiedUploads(fileData);
        } else {
          console.error('Error fetching verified uploads:', res.data.Error);
        }
      })
      .catch((err) => {
        console.error('Error fetching verified uploads:', err);
      });
  }, []);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleVerify = (issuerEmail, filePath, rowIndex) => {
    const verifierEmail = email;
    const userEmail = document.getElementById(`userEmail-${rowIndex}`).value;
    const data = {
      issuerEmail,
      verifierEmail,
      userEmail,
      filePath,
    };

    axios
      .post('http://localhost:8081/verifyUpload', data)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.error('Error verifying upload:', err);
      });
  };

  const renderFilePreview = (file) => {
    window.open(`/previewFile/${encodeURIComponent(file)}`, '_blank');
  };

  return (
    <div>
      {auth ? (
        <div>
          <div
            className="jumbotron jumbotron-fluid"
            id="banner1"
            style={{ backgroundImage: `url("https://t4.ftcdn.net/jpg/04/91/04/57/360_F_491045782_57jOG41DcPq4BxRwYqzLrhsddudrq2MM.jpg")` }}
          >
            <div className="container text-center text-md-left">
              <header>
                <div className="row justify-content-right">
                  <div className="col-6 align-self-center text-right">
                    <Link to="/" onClick={handleDelete} className="text-white lead" id="logout">
                      Logout
                    </Link>
                  </div>
                </div>
              </header>
              <img src={require('./newnewlogo.png')} alt="logo" id="logo" />
              <h3 id="title"> TitleChain</h3>
            </div>
          </div>
          {/* three-block */}
          <div className="container my-5 py-2">
            <h2 id="name" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
              Welcome Verifier: {name}
            </h2>
          </div>

          {/* Display File Paths */}
          <div className="container my-5 py-2">
            <div className="col-md-6">
              <h3 className="text-center">Unverified Uploads</h3>
              <table className="table table-dark table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Issuer Name</th>
                    <th>Issuer Email</th>
                    <th>File Path</th>
                    <th>Preview File</th>
                    <th>User Email</th>
                    <th>Verify</th>
                  </tr>
                </thead>
                <tbody>
                  {unverifiedUploads.map((upload, index) => (
                    <tr key={upload.id}>
                      <td>{upload.issuer_name}</td>
                      <td>{upload.issuer_email}</td>
                      <td>{upload.filePath}</td>
                      <td>
                        {upload.filePath ? (
                          <button className="btn btn-primary" onClick={() => renderFilePreview(upload.filePath)}>
                            Preview
                          </button>
                        ) : (
                          <span>No file available</span>
                        )}
                      </td>
                      <td>
                        <input type="text" id={`userEmail-${index}`} />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleVerify(upload.issuer_email, upload.filePath, index)}
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div id="verifiedUploadTable" className="col-md-6">
              <h3 className="text-center">Verified Uploads</h3>
              <table className="table table-dark table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Issuer Email</th>
                    <th>Verifier Email</th> 
                    <th>File Path</th>
                    <th>Title Deed Holder Email</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedUploads.map((upload) => (
                    <tr key={upload.id}>
                      <td>{upload.issuer_email}</td>
                      <td>{upload.verifier_email}</td>
                      <td>{upload.file_path}</td>
                      <td>{upload.user_email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* contact */}
          <div className="jumbotron jumbotron-fluid" id="contact" style={{ backgroundImage: `url("https://images.squarespace-cdn.com/content/v1/62e74388ac41fd3cd162d1d2/1661329062631-EKRMKOOK91UPZSSYGWGZ/Background.png?format=2500w")` }}>
            <div className="container text-center text-md-left">
              <h1 id="contact" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
                CONTACT US
              </h1>
              <hr data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000"></hr>
              <h5 id="email" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
                E-mail: titlechain@gmail.com
              </h5>
              <h5 id="number" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
                Phone Number: +91 9876543210
              </h5>
              <h5 id="city" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
                City: Bengaluru, Karnataka, India
              </h5>
            </div>
          </div>

          {/* footer */}
          <div className="jumbotron jumbotron-fluid text-center" id="footer">
            <div className="row">
              <div className="col-md-6">
                <div className="container">
                  <h2 id="brand" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
                    TitleChain
                  </h2>
                </div>
              </div>
              <div className="col-md-6">
                <div className="container">
                  <div className="footer_right">
                    <h5 id="follow_us" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
                      Follow Us On:
                    </h5>
                    <div className="footer_social_icon">
                      <Link to="#">
                        <i className="fa fa-facebook" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000"></i>
                      </Link>
                      <Link to="#">
                        <i className="fa fa-linkedin" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000"></i>
                      </Link>
                      <Link to="#">
                        <i className="fa fa-github" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000"></i>
                      </Link>
                      <Link to="#">
                        <i className="fa fa-youtube-play" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>{message}</h1>
          <h3>Login Now</h3>
          <Link to="/login-page" className="link-btn3">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Verifier;