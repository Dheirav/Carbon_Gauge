# Carbon Emissions Tracker

A web-based application designed to track and analyze carbon emissions from industrial and commercial machines. The application helps users input machine parameters, receive emission calculations, check regulatory compliance, visualize data, and obtain tailored mitigation suggestions.

---

## Overview

The Carbon Emissions Tracker enables:
- **Accurate Emission Calculations**: Compute multiple emission components based on predefined formulas.
- **User Role Flexibility**: Choose between **Regular User** (basic inputs and estimates) and **Industrial User** (detailed specification for comprehensive reports).
- **Interactive Analytics**: Visualize historical data, compliance indicators, and data trends.
- **Data Export & Sharing**: Export reports in CSV, JSON, and other formats for further data analysis.

---

## User Roles

- **Regular User**
  - Provides basic machine parameters for a simplified emissions estimate.
  - Receives a basic compliance check and general reduction suggestions.

- **Industrial User**
  - Inputs detailed machine specifications for comprehensive reports.
  - Supports multiple machine entries for factory-wide tracking.
  - Access to advanced data visualizations, trend analysis, and mitigation strategies.

---

## Core Features

1. **Authentication & User Management**  
   - Secure login and registration.
   - Role selection (Regular or Industrial) to customize dashboards and reporting features.

2. **Machine Selection & Calculation**  
   - **Searchable Machine Database:** Quickly find machines by industry, fuel type, or function.
   - **Dynamic Selection:** Options to select pre-defined machines or input custom machines.
   - **Parameter Input System:** Enter key values like fuel consumption, operating hours, and power usage.
   - **Real-Time Calculation Engine:** Utilizes predefined formulas to compute emission components.

3. **Emissions Report & Compliance Analysis**  
   - **Detailed Emissions Breakdown:**
   - **Regulatory Compliance Check:** Compares machine emissions against global environmental standards.
   - **Exportable Reports:** Download reports in PDF, CSV, or JSON formats.

4. **Export & Data Sharing**  
   - Export your data for advanced analysis or integration with sustainability dashboards.

---

## Carbon Emission Calculation Logic

The total carbon emission is calculated as:

  CEms = CEele + CEtool + CEcoolant + CEm + CEchip

Where:

- **CEele (Electrical Emission):**  
  Calculated based on the machine type and brand-specific carbon emission factors (kg CO₂/hr).

- **CEtool (Tool Emission):**  
  $$ CEtool = \left( \frac{T_c}{T_{tool}} \right) \times \text{CFm} \times \text{Mass of Tool} $$  
  – Depends on tool material, run time (Tc), mass of the tool, carbon footprint per unit mass (CFm), and lifetime (Ttool).

- **CEcoolant (Coolant Emission):**  
  $$ CEcoolant = \left( \frac{T}{T_{coolant}} \right) \times (CEoil + CEwc) $$  
  – Incorporates coolant type, run time (T), disposal method, and factors like CEFoil & CEFwc.

- **CEm (Material Emission):**  
  $$ CEm = CEFm \times Mchip $$  
  – Based on workpiece material and chip mass.

- **CEchip (Chip Emission):**  
  $$ CEchip = CEFchip \times Mchip $$  
  – Similar to CEm but uses a different emission factor.

---

## Data Sets for Calculations

### Machine Emission Factors
Emission factors are provided for various machine types (CNC, VMC, Milling, HMC, etc.) and manufacturers. For example:

- **CNC Machines** (e.g., Mazak: 4.75 kg CO₂/hr, DMG Mori: 5.7 kg CO₂/hr, etc.)

### Workpiece Material Emission Factors
Factors based on selected material (e.g., steel, aluminum, copper, etc.) determine CEm and CEchip.

### Coolant and Waste Coolant Emission Factors
Detailed factors for coolant types (mineral-based, synthetic, etc.) including lifetimes and corresponding carbon emission factors are available for calculating CEcoolant.

For full tables and further details, please refer to the documentation or supplementary materials.

---

## Technologies Used

- **Frontend:** React.js (bootstrapped with Create React App)
- **Backend:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Styling & UI:** Material-UI, Chart.js (for analytics)

---

## Project Structure

- **/client:** Contains the React frontend, components, and styling.
- **/server:** Contains the Express backend, API endpoints, and database configuration.
- **/config, /models, /middleware:** Backend-specific directories for configuration, data models, and middleware.

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/carbon-emissions-tracker.git
   ```
2. **Install root dependencies:**
   ```bash
   npm install
   ```
3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```
4. **Environment Variables:**
   - In the `/server` directory, create a `.env` file and add:
     ```
     MONGODB_URI=your_mongo_connection_string
     JWT_SECRET=your_secret_key
     ```
   - Optionally configure authentication bypass for development in your client's environment variables.

### Running the Application

- **Development (concurrently run server and client):**
  ```bash
  npm run dev
  ```
- **Client Only:**
  ```bash
  npm run client
  ```
- **Server Only:**
  ```bash
  npm run server
  ```

### Building for Production

- **Build the client:**
  ```bash
  npm run build
  ```

### Testing

- Run tests with:
  ```bash
  npm test
  ```

---

## Deployment

- **Client:**  
  Follow the [Create React App deployment guide](https://facebook.github.io/create-react-app/docs/deployment) to deploy the frontend.

- **Server:**  
  Ensure proper configuration of environment variables and deploy using your preferred Node.js hosting solution.

---

---
