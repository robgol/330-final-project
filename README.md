Este é o ficheiro `README.md` atualizado, agora em inglês, mantendo o tom profissional e académico exigido para o teu trabalho final do WDD 330.

---

# AeroDash: Aviation Telemetry Dashboard

**Final Project — WDD 330**

## 1. Introduction

**AeroDash** is a modular web application engineered to centralize and interpret critical aviation data. The primary objective is to translate complex data streams — sourced from aviation-specific APIs — into an intuitive, accessible interface for both frequent passengers and industry professionals, eliminating the need for expensive, paid flight planner software to perform quick aerodrome consultations.

## 2. Academic Context and Motivation

This project was developed as the final requirement for the WDD 330 course, demonstrating technical proficiency in the following areas:

* **Asynchronous API Management:** Integration and sanitization of data from *Aviationstack* and *AVWX* REST APIs.
* **Object-Oriented Architecture:** Utilization of ES6 modules to decouple data processing logic (`WeatherProcessor.mjs`) from the rendering layer (`AirportDashboard.mjs`).
* **State Persistence:** Implementation of `localStorage` to manage user preferences and pinned airport nodes (`FavoritesManager.mjs`).

## 3. Technical Challenges

The primary technical challenge involved the **deserialization and formatting of the AVWX API response**. Meteorological forecast reports (TAF) contain nested, dynamic data that varies according to the frequency of weather changes throughout the day. Overcoming this required:

* Precise mapping of complex, dynamic arrays without compromising rendering performance.
* Robust exception handling to prevent runtime errors when accessing potentially undefined properties within the JSON response.

## 4. Software Architecture

The application follows a modular architecture to ensure maintainability and scalability:

* **`main.js`**: Application entry point and global state coordinator.
* **`ExternalAviationServices.mjs`**: Centralized service layer responsible for secure API fetch requests and authentication.
* **`AirportDashboard.mjs`**: Module for processing and rendering operational departure/arrival boards.
* **`WeatherProcessor.mjs`**: Logic module for translating raw METAR/TAF JSON objects into human-readable visual cards.

## 5. Development Timeline (Week 05 - Week 07)

The development followed a strictly structured methodology:

* **Week 05**: Environment setup (Vite), routing configuration, and API integration testing.
* **Week 06**: Implementation of UI logic and dynamic operational filters.
* **Week 07**: Activation of persistence, input sanitization, and comprehensive exception handling.

## 6. Visual Identity

Adhering to design principles for control displays, the aesthetic choices prioritize usability:

* **Color Palette:** *Aeronautical Dark Blue* (#0B192C) to reduce visual fatigue, contrasted with *Alert Yellow* (#FFD700) for critical status indicators.
* **Typography:** Sans-serif typefaces (Inter/Roboto) selected to optimize legibility of technical flight data.

---

*Developed by: IT Director at the Civil Aviation Authority (AAC) of Cape Verde.*
*Project submitted in partial fulfillment of the WDD 330 course requirements.*