import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';

import './css/custom.css';
import './css/bootstrap.min.css';
import './font-awesome-4.7.0/css/font-awesome.min.css';
import './css/aos.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editTitleDeedEmail, setEditTitleDeedEmail] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [verifiedUploads, setVerifiedUploads] = useState([]);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get('http://localhost:8081/')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setAuth(true);
          setName(res.data.name);
          getUsers();
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const getUsers = () => {
    axios
      .get('http://localhost:8081/getUsers')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setUsers(res.data.users);
        } else {
          console.error('Error fetching user details:', res.data.Error);
        }
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
      });
  };

  const handleDelete = () => {
    axios
      .get('http://localhost:8081/logout')
      .then((res) => {
        // window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (user) => {
    setEditUser(user); // Set the entire user object as the editUser state
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleDeleteUser = (email) => {
    setDeleteConfirmation(email);
  };

  const confirmDelete = (email) => {
    axios
      .delete(`http://localhost:8081/deleteUser/${encodeURIComponent(email)}`)
      .then((res) => {
        if (res.data.status === 'Success') {
          getUsers();
        } else {
          console.error('Error deleting user:', res.data.error);
        }
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
      })
      .finally(() => {
        setDeleteConfirmation(null);
      });
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8081/updateUser/${editUser.id}`, {
        name: editName,
        email: editEmail,
        role: editRole,
      })
      .then((res) => {
        if (res.data.Status === 'Success') {
          // Update the user state with the edited user
          const updatedUser = {
            id: editUser.id,
            name: editName,
            email: editEmail,
            role: editRole,
          };
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
          );

          setEditUser(null);
          setEditName('');
          setEditEmail('');
          setEditRole('');

          // Fetch the updated user data from the server
          getUsers();
        } else {
          console.error('Error updating user:', res.data.Error);
        }
      })
      .catch((err) => {
        console.error('Error updating user:', err);
      });
  };

  const handleEditTitleDeedEmail = (uploadId) => {
    const upload = verifiedUploads.find((upload) => upload.id === uploadId);
    if (upload) {
      setEditTitleDeedEmail(upload.user_email);
      handleEdit(upload);
    }
  };

  const handleUpdateTitleDeedEmail = (uploadId) => {
    axios
      .put(`http://localhost:8081/updateVerifiedUpload/${uploadId}`, {
        user_email: editTitleDeedEmail,
      })
      .then((res) => {
        if (res.data.Status === 'Success') {
          // Fetch the updated verified uploads data from the server
          getVerifiedUploads();
          setEditUser(null);
          setEditTitleDeedEmail('');
        } else {
          console.error('Error updating title deed holder email:', res.data.Error);
        }
      })
      .catch((err) => {
        console.error('Error updating title deed holder email:', err);
      });
  };

  const [unverifiedUploads, setUnverifiedUploads] = useState([]);
  const [deleteConfirmationUpload, setDeleteConfirmationUpload] = useState(null);

  useEffect(() => {
    getUnverifiedUploads();
    getVerifiedUploads();
    AOS.init();
  }, []);

  const handleDeleteUpload = (id) => {
    setDeleteConfirmationUpload(id);
  };

  const confirmDeleteUpload = (id) => {
    axios
      .delete(`http://localhost:8081/deleteUnverifiedUpload/${id}`)
      .then((res) => {
        if (res.data.Status === 'Success') {
          // Refresh the unverified uploads list
          getUnverifiedUploads();
        } else {
          console.error('Error deleting unverified upload:', res.data.Error);
        }
      })
      .catch((err) => {
        console.error('Error deleting unverified upload:', err);
      })
      .finally(() => {
        setDeleteConfirmationUpload(null);
      });
  };

  const cancelDeleteUpload = () => {
    setDeleteConfirmationUpload(null);
  };

  const getUnverifiedUploads = () => {
    axios
      .get('http://localhost:8081/getUnverifiedUploads')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setUnverifiedUploads(res.data.uploads);
        } else {
          console.error('Error fetching unverified uploads:', res.data.Error);
        }
      })
      .catch((err) => {
        console.error('Error fetching unverified uploads:', err);
      });
  };

  const getVerifiedUploads = () => {
    axios
      .get('http://localhost:8081/getVerifiedUploads')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setVerifiedUploads(res.data.uploads);
        } else {
          console.error('Error fetching verified uploads:', res.data.Error);
        }
      })
      .catch((err) => {
        console.error('Error fetching verified uploads:', err);
      });
  };

  useEffect(() => {
    getUnverifiedUploads();
    getVerifiedUploads();
    AOS.init();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Admin">
      {auth ? (
        <div>
          <div
            className="jumbotron jumbotron-fluid"
            id="banner1"
            style={{
              backgroundImage: `url("https://t4.ftcdn.net/jpg/04/91/04/57/360_F_491045782_57jOG41DcPq4BxRwYqzLrhsddudrq2MM.jpg")`,
            }}
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

              <img src={require('./newnewlogo.png')} alt="logo" id="logo"></img>

              <h3 id="title"> TitleChain</h3>
            </div>
          </div>

          <div className="container my-5 py-2">
            <h2 id="name" data-aos="fade-down" data-aos-delay="100" data-aos-duration="1000">
              Welcome Admin: {name}
            </h2>
          </div>

          <div className="container my-5">
            <h2 data-aos="fade" data-aos-easing="linear" data-aos-delay="300" data-aos-once="true">User Details</h2>
            <table className="table table-dark table-striped" data-aos="fade" data-aos-easing="linear" data-aos-delay="300" data-aos-once="true">
              <thead className="thead-dark text-center">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Edit Details</th>
                  <th>Delete account</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {editUser && editUser.id === user.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editUser && editUser.id === user.id ? (
                        <input
                          type="text"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editUser && editUser.id === user.id ? (
                        <input
                          type="text"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        />
                      ) : (
                        user.role
                      )}
                    </td>
                    <td>
                      {editUser && editUser.id === user.id ? (
                        <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={handleUpdate}>
                          Save
                        </button>
                      ) : (
                        <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={() => handleEdit(user)}>
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      {deleteConfirmation === user.email ? (
                        <div>
                          <span className="mr-2">Are you sure?</span>
                          <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={() => confirmDelete(user.email)}>
                            Yes
                          </button>
                          <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={cancelDelete}>
                            No
                          </button>
                        </div>
                      ) : (
                        <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={() => handleDeleteUser(user.email)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Unverified upload details */}
          <div className="container my-5">
            <h2 data-aos="fade" data-aos-easing="linear" data-aos-delay="300" data-aos-once="true">Unverified Uploads</h2>
            <table
              id="unverifiedUploads"
              className="table table-dark table-striped"
              data-aos="fade"
              data-aos-easing="linear"
              data-aos-delay="300"
              data-aos-once="true"
            >
              <thead className="thead-dark text-center">
                <tr>
                  <th>Issuer Name</th>
                  <th>Issuer Email</th>
                  <th>File Path</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {unverifiedUploads.map((upload) => (
                  <tr key={upload.id}>
                    <td>{upload.issuer_name}</td>
                    <td>{upload.issuer_email}</td>
                    <td>{upload.file_path}</td>
                    <td>
                      {deleteConfirmationUpload === upload.id ? (
                        <div>
                          <span className="mr-2">Are you sure?</span>
                          <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={() => confirmDeleteUpload(upload.id)}>
                            Yes
                          </button>
                          <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={cancelDeleteUpload}>
                            No
                          </button>
                        </div>
                      ) : (
                        <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={() => handleDeleteUpload(upload.id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="container my-5">
            <h2 data-aos="fade" data-aos-easing="linear" data-aos-delay="300" data-aos-once="true">Verified Uploads</h2>
              <table className="table table-dark table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Issuer Email</th>
                    <th>Verifier Email</th>
                    <th>File Path</th>
                    <th>Title Deed Holder Email</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedUploads.map((upload) => (
                    <tr key={upload.id}>
                      <td>{upload.issuer_email}</td>
                      <td>{upload.verifier_email}</td>
                      <td>{upload.file_path}</td>
                      <td>
                        {editUser && editUser.id === upload.id ? (
                          <input
                            type="text"
                            value={editTitleDeedEmail}
                            onChange={(e) => setEditTitleDeedEmail(e.target.value)}
                          />
                        ) : (
                          upload.user_email
                        )}
                      </td>
                      <td>
                        {editUser && editUser.id === upload.id ? (
                          <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={() => handleUpdateTitleDeedEmail(upload.id)}>
                            Save
                          </button>
                        ) : (
                          <button className="btn-sm t-1 font-weight-bold atlas-cta cta-blue" onClick={() => handleEditTitleDeedEmail(upload.id)}>
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="jumbotron jumbotron-fluid" id="contact">
            {/* Rest of the code */}
          </div>

          <div className="jumbotron jumbotron-fluid" id="copyright">
            {/* Rest of the code */}
          </div>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login-page" className="link-btn3">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Admin;