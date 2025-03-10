# Carbon Emissions Tracker

A web-based application designed to track and analyze carbon emissions from industrial and commercial machines. The application empowers users with tools to input machine parameters, obtain emission calculations, check regulatory compliance, visualize data, and receive tailored mitigation suggestions. The system is built to cater to both general users seeking basic estimates and industrial professionals requiring in-depth insights and compliance assessments.

---

## Overview

The **Carbon Emissions Tracker** provides:

- **Accurate Emission Calculations**: Computes multiple emission components using industry-standard formulas and empirical data.
- **User Role Flexibility**: Supports both **Regular Users** (basic inputs and estimates) and **Industrial Users** (detailed specifications for comprehensive reports and compliance tracking).
- **Interactive Analytics**: Enables visualization of historical data, compliance indicators, and trends to facilitate strategic decision-making.
- **Data Export & Sharing**: Allows users to export reports in CSV, JSON, and other formats for advanced data analysis and integration with external sustainability dashboards.
- **Regulatory Compliance Checks**: Evaluates emissions against global and regional environmental standards to ensure regulatory adherence.
- **Customizable Dashboards**: Tailors user experiences based on role, offering role-specific features and insights.

---

## User Roles

### **Regular User**

- Provides fundamental machine parameters for a simplified emissions estimate.
- Receives a basic compliance check and generalized emission reduction suggestions.
- Accesses historical reports with limited analytical tools.
- Ideal for individuals and small-scale businesses looking for a quick emissions assessment.

### **Industrial User**

- Inputs detailed machine specifications to generate comprehensive emissions reports.
- Supports multiple machine entries, facilitating factory-wide tracking and trend analysis.
- Accesses advanced data visualizations, historical emission trends, and machine performance comparisons.
- Obtains in-depth compliance analysis against regulatory benchmarks.
- Gains actionable mitigation strategies based on machine-specific emission factors and operational parameters.
- Suitable for industries, manufacturing plants, and regulatory bodies requiring deep insights into emissions.

---

## Core Features

### **1. Authentication & User Management**

- Secure login and user registration system.
- Role selection during signup (Regular or Industrial User).
- Personalized dashboards offering relevant tools and reports.
- JWT-based authentication ensuring secure access to user data.

### **2. Machine Selection & Calculation**

- **Searchable Machine Database**: Users can quickly find machines by industry type, fuel type, or function.
- **Dynamic Selection**: Offers predefined machines with preset emission factors or allows custom machine entries.
- **Parameter Input System**: Users can enter key values such as fuel consumption, operating hours, power usage, and material specifics.
- **Real-Time Calculation Engine**: Utilizes predefined and configurable formulas to compute CO₂ and other emission components.
- **Batch Processing**: Industrial users can upload bulk machine data for simultaneous processing.

### **3. Emissions Report & Compliance Analysis**

- **Detailed Emissions Breakdown**: Provides a granular analysis of CO₂, CH₄, NOₓ, and other pollutants.
- **Regulatory Compliance Check**: Compares machine emissions against various international standards (e.g., EPA, EU Emissions Trading System, ISO 14064).
- **Industry-Specific Emission Standards**: Evaluates compliance based on manufacturing sector, fuel types, and operational conditions.
- **Automated Report Generation**: Users receive downloadable reports (PDF, CSV, JSON) with insights, visual data, and compliance status.

### **4. Visualization & Data Analytics**

- **Interactive Charts & Graphs**: Uses Chart.js for dynamic, real-time data visualization.
- **Emission Trends & Forecasting**: Analyzes historical data to predict future emission levels.
- **Comparison Tools**: Compares emissions across different machines, time periods, or operational settings.
- **Geospatial Mapping**: Provides an emissions heatmap displaying high-pollution zones and machine contributions.

### **5. Export & Data Sharing**

- **Multi-Format Export**: Supports CSV, JSON, PDF, and API integration.
- **Collaboration & Sharing**: Users can share reports internally or with external auditors and regulatory agencies.
- **API Integration**: Allows seamless connectivity with sustainability dashboards, IoT sensors, and ERP systems.

---

## Data Sets for Calculations

### **Machine Emission Factors**

Emission factors are determined for various machine types such as CNC, VMC, Milling, HMC, and others. Factors include:

- Fuel type and efficiency
- Operational power consumption
- Machine-specific CO₂ output per hour

### **Workpiece Material Emission Factors**

Different materials influence emissions based on their processing characteristics:

- **Steel:** Higher emission factors due to energy-intensive processing.
- **Aluminum:** Moderate emissions with high recyclability impact.
- **Copper:** Variable emissions based on refining and processing techniques.

### **Coolant and Waste Coolant Emission Factors**

- **Coolant Type:** Mineral-based, synthetic, and water-soluble coolant emissions.
- **Lifetime Impact:** How coolant degradation affects emissions over time.
- **Disposal & Recycling:** Emission factors based on proper disposal or reuse.

---

## Technologies Used

### **Frontend**

- React.js (bootstrapped with Create React App)
- Material-UI for styling and component design
- Chart.js for dynamic data visualization

### **Backend**

- Express.js for server-side logic
- Mongoose for MongoDB database interactions
- JWT authentication for secure access

### **Database**

- MongoDB with schema validation for structured emissions data storage

### **API & Data Integration**

- Third-party emissions factor databases for accurate calculations
- IoT sensor compatibility for real-time emissions tracking

---

## Getting Started

### **Prerequisites**

- Node.js (v14+)
- npm or yarn
- MongoDB instance (local or cloud-based)

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/carbon-emissions-tracker.git
   ```
2. **Install dependencies:**
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

### **Running the Application**

- **Development (run server and client concurrently):**
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

### **Building for Production**

- **Build the client:**
  ```bash
  npm run build
  ```

### **Testing**

- Run unit tests with:
  ```bash
  npm test
  ```

---

## Future Enhancements

- **AI-Powered Emission Reduction Suggestions**
- **Integration with Carbon Credit Trading Platforms**
- **Blockchain-based Emission Tracking for Transparency**
- **Mobile Application Support**
- **Custom User Notifications & Alerts**

This README provides comprehensive information on the **Carbon Emissions Tracker** application. For any contributions, please refer to the contribution guidelines in `CONTRIBUTIONS.md`. 

