import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { showdateFormat } from "../utils/common";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Buttons from "./Buttons";
import Popup from "./Popup";
import validator from "validator";

function Home() {
  const a = "AM";
  const b = "PM";
  const pattern = /^(d{3})s*d{3}(?:-|s*)d{4}$/;
  const todayTime = new Date();
  const date = new Date();
  let hours = todayTime.getHours();
  let minutes = todayTime.getMinutes();

  let nowTime = `${hours}:${minutes}`;

  const [value, setValue] = React.useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [sortedTime, setSortedTime] = useState([]);
  const [token, setToken] = useState([]);
  let orderedList = [];
  const [filteredList, setFilteredList] = useState([]);
  // eslint-disable-next-line
  const [serviceId, setServiceID] = useState(""); //eslint-disable-line
  const [status, setStatus] = useState(""); //eslint-disable-line
  const [time, setTime] = useState([]);
  const [isactive, setIsActive] = useState(false); //eslint-disable-line
  // eslint-disable-next-line
  const [allValues, setAllValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contact: "",
    comment: "",
    time: "",
  });
  const changeHandler = (e) => {
    if (e.target.name == "time") {
      setAllValues({
        ...allValues,
        [e.target.name]: e.target.value.substring(0, 5),
      });
    } else {
      setAllValues({ ...allValues, [e.target.name]: e.target.value });
    }
  };

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;

  const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  const handleChange = (newValue) => {
    console.log(`working ${newValue}, ${appointments.length}`);
    appointments.length !== "null" &&
      // eslint-disable-next-line
      appointments.map((slot) => {
        console.log("appointments");
        // setServiceID(slot.service_id);
        // eslint-disable-next-line
        console.log(`Selected date ${value}`);
        slot.service_slots.map((timing) => {
          if (timing["date"] === showdateFormat({ date: value })) {
            setTime([...timing.slots]);
          }
        });
        // setOrderedList([]);
        orderedList = [];
        time.map((e) => {
          if (e >= "10:00" && e < "12:00") {
            //const newList = [...orderedList, `${e} AM`];
            console.log(`orderedlist ${orderedList.length}`);
            // setOrderedList((ol) => [...ol, `${e} AM`]);
            orderedList = [...orderedList, `${e} AM`];
            console.log(`after orderedlist ${orderedList.length}`);
          }
        });
        time.map((e) => {
          if (e >= "12:00" && e <= "12:40") {
            orderedList = [...orderedList, `${e} PM`];
            // setOrderedList((ol) => [...ol, `${e} PM`]);
          }
        });
        time.map((e) => {
          if (e >= "01:00" && e < "10:00") {
            orderedList = [...orderedList, `${e} PM`];
            // setOrderedList((ol) => [...ol, `${e} PM`]);
          }
        });
        console.log(orderedList.length, "orderedlist");
        setFilteredList([]);
        orderedList.map((e) => {
          if (showdateFormat({ date: value }) === today) {
            if (convertTime12to24(nowTime) < convertTime12to24(e)) {
              console.log(`Filtered Time ${e}`);
              setFilteredList((fl) => [...fl, e]);
            }
          } else {
            setFilteredList((fl) => [...fl, e]);
          }
        });
      });
  };

  const endindex = time[time.indexOf(allValues.time) + 1];

  useEffect(() => {
    console.log("Running UseEffect");
    axios
      .get(
        "https://h5vx3l2vwdiaobjnp3rp4hcyni0nkaid.lambda-url.ap-south-1.on.aws/"
      )
      .then((response) => {
        console.log(response.data, "response");
        setAppointments([...response.data]);
        console.log(appointments, "appoint");

        handleChange(value);
      }) //eslint-disable-line
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("https://developer.setmore.com/api/v1/o/oauth2/token", {
        params: {
          refreshToken: "r1/cb72dbe0098HDmS_Ax0lw1FK4iDn3S0H056uWSl55q9vl",
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        // console.log(response.data.data.token);
        // console.log(response.data.data.token.access_token)
        setToken(response.data.data.token.access_token);
        setStatus(response.status);
      })
      .catch((error) => console.log(error));
  }, []);

  const validateForm = () => {
    console.log(allValues.time);
    if (!serviceId) {
      alert("Please Select Service");
    } else if (
      allValues.firstname === "" ||
      /\d/.test(allValues.firstname) === true
    ) {
      alert("Please enter valid First Name");
    } else if (
      allValues.lastname === "" ||
      /\d/.test(allValues.lastname) === true
    ) {
      alert("Please enter valid Last Name");
    } else if (
      allValues.contact === "" ||
      allValues.contact.length !== 10 ||
      pattern.test(allValues.contact) ||
      allValues.contact.charAt(0) === "-"
    ) {
      alert("Please enter valid contact");
    } else if (
      allValues.email === "" ||
      validator.isEmail(allValues.email) !== true
    ) {
      alert("Please enter valid email");
    } else if (value.getDate() < new Date().getDate()) {
      alert("Invalid Date");
    } else if (allValues.time === "") {
      alert("Please enter time");
    } else {
      console.log();
      setIsActive(true);
      console.log(allValues.contact.length < 10);
    }
  };

  return (
    <div>
      {isactive && (
        <div className="popup-background">
          <Popup
            allValues={allValues}
            serviceId={serviceId}
            endindex={endindex}
            value={value}
            setIsActive={setIsActive}
            convertTime12to24={convertTime12to24}
          />
        </div>
      )}
      <div className="banner">
        <img
          src="https://cdn11.bigcommerce.com/s-2qk49wb9fq/content/health-tech-doc-consult/img/banner.png"
          alt=""
        />
      </div>
      <div className="title">
        <p>Ayurvedic consultation with experienced</p>
        <div className="inline">
          <hr />
          <p className="single-line">doctors and nutritionists</p>
          <hr />
        </div>
      </div>
      <div className="options">
        {status === 200 ? (
          <Buttons token={token} setServiceID={setServiceID} />
        ) : (
          "Loading......"
        )}
        <hr />
        <div className="form">
          <div className="name">
            <input
              type="text"
              placeholder="First Name"
              name="firstname"
              className="border"
              value={allValues.firstname}
              onChange={changeHandler}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastname"
              className="border"
              value={allValues.lastname}
              onChange={changeHandler}
              required
            />
            <input
              type="number"
              placeholder="Contact No"
              name="contact"
              className="border"
              value={allValues.contact}
              onChange={changeHandler}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="border"
              value={allValues.email}
              onChange={changeHandler}
              required
            />
          </div>

          <p className="whatsapp-text">
            <input type="checkbox" />
            Get updates on
            <img
              src="https://cdn11.bigcommerce.com/s-2qk49wb9fq/content/health-tech-doc-consult/img/whatsapp-logo-1.png"
              alt="whatsapp"
            />
            <span>whatsapp</span> You may opt out anytime
          </p>
          <div className="main">
            <textarea
              placeholder="Comments ?"
              name="comment"
              value={allValues.comment}
              onChange={changeHandler}
            />
          </div>
          <div className="name">
            <div>
              <p className="date-time-text ">Choose A Date</p>
              <p className="additional-text time-height date-adjustment"></p>
            </div>
            <div>
              <p className="date-time-text ">Choose A Slot</p>
              <p className="additional-text time-height date-adjustment">
                (1 hour slots between <br /> 10AM - 7PM)
              </p>
            </div>

            <div className="date-adjustment">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Date mobile"
                  inputFormat="MM/dd/yyyy"
                  style={{ fontSize: "23px" }}
                  value={value}
                  disablePast={true}
                  onChange={(value) => setValue(value)}
                  onAccept={handleChange}
                  onOpen={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div className="date-adjustment">
              <select
                name="time"
                id="time"
                style={{ fontWeight: "500" }}
                // autoComplete="off"
                onChange={changeHandler}
              >
                <option value={""}>None</option>
                {filteredList.map((t) => {
                  return <option value={t}>{t}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
        <input
          onClick={() => validateForm()}
          type="submit"
          className="submit-btn"
          name="Submit"
        />
      </div>
    </div>
  );
}

export default Home;
