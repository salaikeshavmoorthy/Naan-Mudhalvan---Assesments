import axios from 'axios';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Swal from 'sweetalert2';

import EmailInput from '../../templates/EmailInput';
import PasswordInput from '../../templates/PasswordInput';
import AgeInput from '../../templates/AgeInput';
import TimeInput from '../../templates/TimeInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button } from '@mui/material';

const Register = () => {
    const [userType, setUserType] = useState('buyer');
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        number: '',
        age: '',
        batch: 'UG1',
        shop_name: '',
        manager_name: '',
        opening_time: "12:00",
        closing_time: "12:00",
        password: '',
    });
    const [error, setError] = useState({
        email: false,
        age: false,
        password: false,
        opening_time: false,
        closing_time: false,
    });

    const matches = useMediaQuery('(min-width:480px)');

    // Handle user type change
    const handleUserTypeChange = event => {
        setUserType(event.target.value);
    }

    // Validate user details
    const validateUserDetails = () => {
        if (userType === 'buyer') {
            if (userDetails.name === '' || userDetails.email === '' || userDetails.number === '' || userDetails.age === '' || userDetails.password === '' || error.email || error.age || error.password) {
                Swal.fire({
                    title: 'Error',
                    text: 'Please fill all the details and/or fix errors!!',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });

                return false;
            }
        } else {
            if (userDetails.email === '' || userDetails.number === '' || userDetails.shop_name === '' || userDetails.manager_name === '' || userDetails.opening_time === '' || userDetails.closing_time === '' || userDetails.password === '' || error.email || error.opening_time || error.closing_time || error.password) {
                Swal.fire({
                    title: 'Error',
                    text: 'Please fill all the details and/or fix errors!',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });

                return false;
            }
        }

        return true;
    };

    // Handle form submission
    const handleFormSubmit = event => {
        event.preventDefault();

        if (!validateUserDetails())
            return;

        if (userType === 'buyer') {
            const buyer = {
                name: userDetails.name,
                email: userDetails.email,
                number: userDetails.number,
                age: userDetails.age,
                batch: userDetails.batch,
                password: userDetails.password,
            };

            // Send POST request to backend
            axios.post('/api/buyers/register', buyer)
                .then(res => {
                    // Set tokens in local storage
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user_type', userType);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'You have successfully registered!',
                    }).then(() => {
                        // Redirect to home page
                        window.location = '/';
                    });
                }).catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: `${err.response.data.error}!`
                    })
                });
        } else {
            const vendor = {
                email: userDetails.email,
                number: userDetails.number,
                shop_name: userDetails.shop_name,
                manager_name: userDetails.manager_name,
                opening_time: userDetails.opening_time,
                closing_time: userDetails.closing_time,
                password: userDetails.password,
            };

            // Send POST request to backend
            axios.post('/api/vendors/register', vendor)
                .then(res => {
                    // Set tokens in local storage
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user_type', userType);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'You have successfully registered!',
                    }).then(() => {
                        // Redirect to login page
                        window.location = '/';
                    });
                }).catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: `${err.response.data.error}!`
                    })
                });
        }
    }

    return (
        <div className="registration-form">
            {matches ?
                <Typography className="registration-heading" variant="h3" component="h1">
                    Register
                </Typography>
                :
                <Typography className="registration-heading" variant="h4" component="h1">
                    Register
                </Typography>
            }
            <Grid container direction="column" spacing={4} alignItems="center">
                <Grid item>
                    <TextField
                        select
                        label="User Type"
                        variant="outlined"
                        value={userType}
                        onChange={handleUserTypeChange}
                    >
                        <MenuItem value="buyer">Buyer</MenuItem>
                        <MenuItem value="vendor">Vendor</MenuItem>
                    </TextField>
                </Grid>
                {userType === "buyer" ?
                    <>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                                value={userDetails.name}
                                onChange={event => setUserDetails({ ...userDetails, name: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <EmailInput
                                userDetails={userDetails}
                                setObjectValue={setUserDetails}
                                errorDetails={error}
                                setErrorValue={setError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <PasswordInput
                                className="registration-password-input"
                                userDetails={userDetails}
                                setObjectValue={setUserDetails}
                                errorDetails={error}
                                setErrorValue={setError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <AgeInput
                                label="Age"
                                userDetails={userDetails}
                                setObjectValue={setUserDetails}
                                errorDetails={error}
                                setErrorValue={setError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <PhoneInput
                                country={'in'}
                                value={userDetails.number}
                                placeholder="Phone Number"
                                onChange={value => setUserDetails({ ...userDetails, number: value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Batch"
                                variant="outlined"
                                value={userDetails.batch}
                                onChange={event => setUserDetails({ ...userDetails, batch: event.target.value })}
                            >
                                <MenuItem value="UG1">UG1</MenuItem>
                                <MenuItem value="UG2">UG2</MenuItem>
                                <MenuItem value="UG3">UG3</MenuItem>
                                <MenuItem value="UG4">UG4</MenuItem>
                                <MenuItem value="UG5">UG5</MenuItem>
                            </TextField>
                        </Grid>
                        <Button
                            className="submit-button"
                            variant="contained"
                            color="primary"
                            onClick={handleFormSubmit}
                        >
                            Register
                        </Button>
                    </>
                    :
                    <>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Shop name"
                                variant="outlined"
                                value={userDetails.shop_name}
                                onChange={event => setUserDetails({ ...userDetails, shop_name: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="outlined-basic"
                                label="Manager name"
                                variant="outlined"
                                value={userDetails.manager_name}
                                onChange={event => setUserDetails({ ...userDetails, manager_name: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <EmailInput
                                userDetails={userDetails}
                                setObjectValue={setUserDetails}
                                errorDetails={error}
                                setErrorValue={setError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <PasswordInput
                                className="registration-password-input"
                                userDetails={userDetails}
                                setObjectValue={setUserDetails}
                                errorDetails={error}
                                setErrorValue={setError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <PhoneInput
                                country={'in'}
                                value={userDetails.number}
                                placeholder="Phone Number"
                                onChange={value => setUserDetails({ ...userDetails, number: value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TimeInput
                                label="Opening time"
                                userDetails={userDetails}
                                setObjectValue={setUserDetails}
                                errorDetails={error}
                                setErrorValue={setError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TimeInput
                                label="Closing time"
                                userDetails={userDetails}
                                setObjectValue={setUserDetails}
                                errorDetails={error}
                                setErrorValue={setError}
                            />
                        </Grid>
                        <Button
                            className="submit-button"
                            variant="contained"
                            color="primary"
                            onClick={handleFormSubmit}
                        >
                            Register
                        </Button>
                    </>
                }
            </Grid>
        </div>
    );
};

export default Register;import { useState, useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import ItemCard from "../../templates/ItemCard";
import axios from "axios";
import ItemAdd from "../../templates/ItemAdd";


const VendorDashboard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("/api/items/vendor", {
        headers: {
          authorization: localStorage.getItem("token")
        }
      })
      .then(res => {
        setItems(res.data);
      });
  }, []);

  // Calculate the average rating for the item
  const computeRating = item => {
    let sum = 0;
    for (let i = 0; i < item.rating.count; i++) {
      sum += item.rating.ratings[i];
    }
    let res = sum / parseFloat(item.rating.count);
    return isNaN(res) ? 0 : res;
  }

  // Handle item deletion
  const handleDelete = item => {
    setItems(items.filter(i => i._id !== item._id));
  };

  // Handle item update
  const handleUpdate = item => {
    setItems(items.map(i => (i._id === item._id ? item : i)));
  };

  // Handle item addition
  const handleAddition = item => {
    setItems([...items, item]);
  };

  const matches = useMediaQuery('(min-width:480px)');

  return (
    <div>
      {matches ?
        <Typography className="dashboard-heading" variant="h3" component="h1">
          My Items
        </Typography>
        :
        <Typography className="dashboard-heading" variant="h4" component="h1">
          My Items
        </Typography>
      }

      <Grid
        className="item-grid"
        container
        columns={13}
        spacing={2}
        justifyContent="center"
        wrap="wrap"
        rowSpacing={4}
      >
        {items.length > 0 ?
          items.map((item) => {
            return (
              <Grid key={item._id} item xs={10} sm={6} md={4} lg={3}>
                <ItemCard
                  item={item}
                  vendor=""
                  computeRating={computeRating}
                  onEdit={handleUpdate}
                  onDelete={handleDelete}
                />
              </Grid>
            );
          })
          :
          <Typography variant="h5" component="h1">
            No items listed yet.
          </Typography>
        }
        <ItemAdd
          onAdd={handleAddition}
        ></ItemAdd>
      </Grid>
    </div>
  );
};

export default VendorDashboard;