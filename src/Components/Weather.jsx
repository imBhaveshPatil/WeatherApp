import React, { useEffect, useRef, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import "./Weather.css";
import SearchIcn from "../assets/search.png";
import ClearIcn from "../assets/clear.png";
import CloudIcn from "../assets/cloud.png";
import DrizzleIcn from "../assets/drizzle.png";
import HumidityIcn from "../assets/humidity.png";
import RainIcn from "../assets/rain.png";
import WindIcn from "../assets/wind.png";
import SnowIcn from "../assets/snow.png";

const Weather = () => {
  const inputRef = useRef();
  const initRender = useRef(true);
  const [weatherData, setWeatherData] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState("info");

  const allIcons = {
    "01d": ClearIcn,
    "01n": ClearIcn,
    "02d": CloudIcn,
    "02n": CloudIcn,
    "03d": CloudIcn,
    "03n": CloudIcn,
    "04d": DrizzleIcn,
    "04n": DrizzleIcn,
    "09d": RainIcn,
    "09n": RainIcn,
    "010d": RainIcn,
    "010n": RainIcn,
    "013d": SnowIcn,
    "013n": SnowIcn,
  };
  const apiKey = "9b01468f559c528ac3535c9a18273925";

  const search = async (city) => {
    if (!city.trim()) {
      setToastMsg("Enter a valid city name");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      const res = await fetch(url);

      if (!res.ok) {
        const errorMessage = `Error ${res.status}: ${res.statusText}`;
        setToastMsg(errorMessage);
        setToastVariant("danger");
        setShowToast(true);
        console.error("HTTP Error: ", errorMessage);
        return;
      }

      const data = await res.json();

      if (data.cod !== 200) {
        setToastMsg(data.message || "An unknown error occurred");
        setToastVariant("danger");
        setShowToast(true);
        setWeatherData(false);
        console.error("API Response Error: ", data);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || ClearIcn;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      setToastMsg("An error occurred while fetching weather data");
      setToastVariant("danger");
      setShowToast(true);
      console.error("Fetch error:- ", error);
    }
  };

  useEffect(() => {
    if (initRender.current) {
      initRender.current = false;
      search("surat");
    }
  }, []);
  return (
    <div className="weather">
      <div className="search-bar">
        <input type="text" ref={inputRef} placeholder="Search" />
        <img
          src={SearchIcn}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="Clear" className="weather-icon" />
          <p className="tempr">{weatherData.temperature}°c</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={HumidityIcn} alt="humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={WindIcn} alt="windicn" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-weather-data text-center my-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4275/4275493.png"
            alt="No Data"
            style={{ width: "150px", marginBottom: "20px" }}
          />
          <h4 className="text-muted">Oops! No Weather Data Found</h4>
          <p className="text-secondary">
            We couldn’t find any data for the specified location. Please check
            the city name and try again.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => inputRef.current.focus()}
          >
            Search Again
          </button>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          className={`bg-${toastVariant} text-white shadow-lg rounded-3`}
          style={{ minWidth: "300px", border: "none" }}
        >
          <Toast.Header
            closeButton={false}
            className={`bg-${toastVariant} text-white rounded-3`}
          >
            <div className="d-flex align-items-center">
              {/* Add Icon */}
              {toastVariant === "danger" && (
                <i className="bi bi-exclamation-circle-fill me-2"></i>
              )}
              {toastVariant === "success" && (
                <i className="bi bi-check-circle-fill me-2"></i>
              )}
              {toastVariant === "info" && (
                <i className="bi bi-info-circle-fill me-2"></i>
              )}
              <strong className="me-auto">Notification</strong>
            </div>
          </Toast.Header>
          <Toast.Body className="fs-6">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Weather;
