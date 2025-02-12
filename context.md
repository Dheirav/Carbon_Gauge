# Carbon Emissions Tracking App

## 1. Overview
A web-based application designed to track and analyze **carbon emissions from industrial and commercial machines**.  
Users input **machine parameters**, receive **emission calculations**, check **compliance with regulations**, visualize data, and get **mitigation suggestions**.

---

## 2. User Roles  
### 2.1 **Regular User**  
- Provides **basic machine parameters** for a **simplified emissions estimate**.  
- Receives a **basic compliance check** and **general reduction suggestions**.  

### 2.2 **Industrial User**  
- Inputs **detailed machine specifications** for **comprehensive reports**.  
- Supports **multiple machine entries** for factory-wide tracking.  
- Access to **advanced data visualizations, trend analysis, and mitigation strategies**.  

---

## 3. Core Features  

### 3.1 **Authentication & User Management**  
-
- **User Role Selection** – Choose between **Regular User** and **Industrial User** accounts.  


### 3.2 **Machine Selection & Calculation**  
- **Searchable Machine Database** – Users can search from a **predefined database** of machines.  
- **Dynamic Machine Selection** – Machines are categorized by **industry type, fuel type, and function**.  
- **Custom Machine Entry (Optional)** – Industrial users can manually input **new machine types**.  
- **Parameter Input System** – Users provide **key parameters** like fuel consumption, hours, and power usage.  
- **Auto-Fill Estimates** – Missing parameters **auto-fill with industry-standard values**.  
- **Real-Time Calculation Engine** – Emissions are computed using **predefined formulas**.  

### 3.3 **Emissions Report & Compliance Analysis**  
- **Detailed Emissions Breakdown** – Reports include **CO₂, NOx, SOx, and particulate emissions**.  
- **Regulatory Compliance Check** – Machine emissions are compared against **global environmental standards**.  
- **Risk Indicator** – **Traffic-light system (Green, Yellow, Red)** to indicate **compliance levels**.  
- **Industry Benchmarking** – Compare emissions against **industry best practices**.  
- **Exportable Reports** – Downloadable in **PDF, CSV, or JSON formats**.  

### 3.4 **Geospatial Emissions Mapping (Heatmap)**  
- **Location-Based Emissions Tracking** – Users enter **geographical location** of machines.  
- **Heatmap Visualization** – Displays **high-emission areas using color-coded intensity levels**.  

### 3.5 **Export & Data Sharing**  
- **Download Reports** – Users can download **PDF, CSV, and JSON reports**.  
- **API Integration (Optional)** – Industrial users can **integrate data with sustainability dashboards**.  


---
# Carbon Emission Calculation Logic

## Formula  
The total carbon emission is calculated as:  

$$ CEms = CEele + CEtool + CEcoolant + CEm + CEchip $$  

## Components  

### 1. **Electrical Emission (CEele)**  
- **User Input:**  
  1. Select machine type (CNC, VMC, etc.).  
  2. Select brand (Mazak, DMG Mori, Makino, etc.).  

- **Calculation:**  
  - Retrieve the brand's carbon emission factor (kg CO₂/hr).  

**Example:**  
If the user selects **CNC → Mazak**, then **CEele = 4.75 kg CO₂/hr**.  

---

### 2. **Tool Emission (CEtool)**  
- **Formula:**  
  $$ CEtool = \left( \frac{T_c}{T_{tool}} \right) \times \text{CFm} \times \text{Mass of Tool} $$  

- **User Input:**  
  1. Select tool material (PCD, CBN, etc.).  
  2. Enter **run time (Tc) in seconds**.  
  3. Enter **mass of the tool (kg)**.  

- **Calculation:**  
  - Fetch **carbon footprint (CFm) per kg** based on material.  
  - Fetch **Ttool (lifetime)** based on material.  
  - Apply formula.  

**Example:**  
If the user selects **High-Speed Steel (HSS):**  
- CFm = 15 kg CO₂/kg  
- Ttool = 10  
- Mass = 2 kg  
- Run time = 500 sec  

$$ CEtool = \left( \frac{500}{10} \right) \times 15 \times 2 $$  

---

### 3. **Coolant Emission (CEcoolant)**  
- **Formula:**  
  $$ CEcoolant = \left( \frac{T}{T_{coolant}} \right) \times (CEoil + CEwc) $$  

- **User Input:**  
  1. Select coolant type (Mineral-based, Synthetic, etc.).  
  2. Enter **run time (T)**.  
  3. Select **coolant disposal method** (Recycled, Disposed, etc.).  

- **Calculation:**  
  - Fetch **Tcoolant (lifetime)** and **CEFoil** based on coolant type.  
  - Fetch **CEFwc** based on disposal method.  
  - Calculate:  

  $$ CEoil = CEFoil \times 13 $$  
  $$ CEwc = CEFwc \times 260 $$  
  $$ CEcoolant = \left( \frac{T}{T_{coolant}} \right) \times (CEoil + CEwc) $$  

**Example:**  
If the user selects **Mineral-based Coolant**:  
- **Tcoolant** = 8  
- **CEFoil** = 2  
- **Recycled disposal (CEFwc)** = 0.25  

---

### 4. **Material Emission (CEm)**  
- **Formula:**  
  $$ CEm = CEFm \times Mchip $$  

- **User Input:**  
  1. Select workpiece material (Steel, Aluminum, etc.).  
  2. Enter **mass of the chip (kg)**.  

- **Calculation:**  
  - Fetch **CEFm** based on material type.  
  - Multiply by mass of the chip.  

**Example:**  
If the user selects **Steel (CEFm = 2)** and mass = 2 kg:  

$$ CEm = 2 \times 2 $$  

---

### 5. **Chip Emission (CEchip)**  
- **Formula:**  
  $$ CEchip = CEFchip \times Mchip $$  

- **User Input:**  
  - Uses **same material selection and chip mass** as **CEm**.  

- **Calculation:**  
  - Fetch **CEFchip** based on material type.  
  - Multiply by **Mchip**.  

**Example:**  
If the user selects **Steel (CEFchip = 0.367)** and mass = 2 kg:  

$$ CEchip = 0.367 \times 2 $$  

---

## **Final Calculation:**  
After computing all components, sum them up:  

$$ CEms = CEele + CEtool + CEcoolant + CEm + CEchip $$  

---

## **Next Steps**  
- **Backend Implementation:** Use **Express.js** for calculations.  
- **Frontend UI:** Create a **step-by-step input form** in **React.js**.  
- **Database Schema:** Store emission factors for **machines, brands, materials, disposal methods** in MongoDB.  
- **Optimization:**  
  - Auto-fill default values where possible.  
  - Provide real-time feedback on emission calculations.  

Would you like code snippets for the backend logic, or do you need UI design ideas?  


data sets to be used for the calculations:

## Machine Emission Factors


### CNC Machines
| Manufacturer              | Average Power Consumption (kW) | Carbon Intensity of Electricity (kg CO₂/kWh) | Estimated Emission Factor (kg CO₂/hour) |
|---------------------------|-------------------------------|---------------------------------------------|----------------------------------------|
| Mazak                     | 10                            | 0.475                                       | 4.75                                   |
| DMG Mori                  | 12                            | 0.475                                       | 5.7                                    |
| Haas Automation           | 8                             | 0.475                                       | 3.8                                    |
| Okuma Corporation         | 15                            | 0.475                                       | 7.13                                   |
| Hurco Companies, Inc.     | 9                             | 0.475                                       | 4.28                                   |
| Makino                    | 12                            | 0.475                                       | 5.7                                    |
| Fanuc Corporation         | 6                             | 0.475                                       | 2.85                                   |
| Doosan Machine Tools      | 10                            | 0.475                                       | 4.75                                   |
| Matsuura Machinery        | 14                            | 0.475                                       | 6.65                                   |
| Brother Industries        | 5                             | 0.475                                       | 2.38                                   |

### VMC Machines
| Manufacturer              | Average Power Consumption (kW) | Carbon Intensity of Electricity (kg CO₂/kWh) | Estimated Emission Factor (kg CO₂/hour) |
|---------------------------|-------------------------------|---------------------------------------------|----------------------------------------|
| Mazak                     | 12                            | 0.475                                       | 5.7                                    |
| DMG Mori                  | 15                            | 0.475                                       | 7.13                                   |
| Haas Automation           | 10                            | 0.475                                       | 4.75                                   |
| Okuma Corporation         | 14                            | 0.475                                       | 6.65                                   |
| Makino                    | 18                            | 0.475                                       | 8.55                                   |
| Fanuc Corporation         | 8                             | 0.475                                       | 3.8                                    |
| Doosan Machine Tools      | 12                            | 0.475                                       | 5.7                                    |
| Matsuura Machinery        | 16                            | 0.475                                       | 7.6                                    |
| Brother Industries        | 6                             | 0.475                                       | 2.85                                   |
| Hyundai WIA               | 14                            | 0.475                                       | 6.65                                   |

### Milling Machines
| Manufacturer              | Average Power Consumption (kW) | Carbon Intensity of Electricity (kg CO₂/kWh) | Estimated Emission Factor (kg CO₂/hour) |
|---------------------------|-------------------------------|---------------------------------------------|----------------------------------------|
| Mazak                     | 8                             | 0.475                                       | 3.8                                    |
| DMG Mori                  | 10                            | 0.475                                       | 4.75                                   |
| Haas Automation           | 7                             | 0.475                                       | 3.33                                   |
| Okuma Corporation         | 12                            | 0.475                                       | 5.7                                    |
| Makino                    | 15                            | 0.475                                       | 7.13                                   |
| Fanuc Corporation         | 5                             | 0.475                                       | 2.38                                   |
| Doosan Machine Tools      | 9                             | 0.475                                       | 4.28                                   |
| Matsuura Machinery        | 11                            | 0.475                                       | 5.23                                   |
| Brother Industries        | 6                             | 0.475                                       | 2.85                                   |
| Hyundai WIA               | 10                            | 0.475                                       | 4.75                                   |

### HMC Machines
| Manufacturer              | Average Power Consumption (kW) | Carbon Intensity of Electricity (kg CO₂/kWh) | Estimated Emission Factor (kg CO₂/hour) |
|---------------------------|-------------------------------|---------------------------------------------|----------------------------------------|
| Mazak                     | 15                            | 0.475                                       | 7.13                                   |
| DMG Mori                  | 18                            | 0.475                                       | 8.55                                   |
| Haas Automation           | 12                            | 0.475                                       | 5.7                                    |
| Okuma Corporation         | 20                            | 0.475                                       | 9.5                                    |
| Makino                    | 22                            | 0.475                                       | 10.45                                  |
| Fanuc Corporation         | 10                            | 0.475                                       | 4.75                                   |
| Doosan Machine Tools      | 16                            | 0.475                                       | 7.6                                    |
| Matsuura Machinery        | 18                            | 0.475                                       | 8.55                                   |
| Brother Industries        | 8                             | 0.475                                       | 3.8                                    |
| Hyundai WIA               | 16                            | 0.475                                       | 7.6                                    |

### Grinding Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| JTEKT Toyoda              | 5–10                          | 4–8                                        |
| United Grinding           | 3–15                          | 2.4–12                                     |
| Jainnher Machine Co., Ltd.| 2–8                           | 1.6–6.4                                    |
| Makino                    | 10–20                         | 8–16                                       |
| EMAG                      | 5–12                          | 4–9.6                                      |
| Koyo Machinery            | 3–10                          | 2.4–8                                      |
| Phillips Machine Tools    | 5–15                          | 4–12                                       |
| Komatsu NTC Ltd.          | 7–15                          | 5.6–12                                     |
| J. SCHNEEBERGER Maschinen AG | 3–8                       | 2.4–6.4                                    |
| Haas Automation           | 5–10                          | 4–8                                        |

### 3D Printers
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Ultimaker                 | 0.1–0.5                       | 0.08–0.4                                   |
| Stratasys                 | 0.5–2.0                       | 0.4–1.6                                    |
| Formlabs                  | 0.05–0.3                      | 0.04–0.24                                  |
| MakerBot                  | 0.1–0.6                       | 0.08–0.48                                  |
| Prusa Research            | 0.05–0.2                      | 0.04–0.16                                  |
| EOS (Electro Optical Systems) | 2.0–10.0                 | 1.6–8.0                                    |
| XYZprinting               | 0.1–0.5                       | 0.08–0.4                                   |
| Anycubic                  | 0.05–0.3                      | 0.04–0.24                                  |
| 3D Systems                | 0.5–2.0                       | 0.4–1.6                                    |
| Creality                  | 0.1–0.4                       | 0.08–0.32                                  |

### Hydraulic Presses
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Schuler Group             | 15–50                         | 12–40                                      |
| Hidralmac                 | 10–30                         | 8–24                                       |
| Beckwood Press            | 15–60                         | 12–48                                      |
| Greenerd Press & Machine  | 10–40                         | 8–32                                       |
| Macrodyne Technologies    | 20–100                        | 16–80                                      |
| Dake Corporation          | 5–20                          | 4–16                                       |
| Savage Engineering        | 10–50                         | 8–40                                       |
| Neff Press                | 15–40                         | 12–32                                      |
| Gasbarre Products Inc.    | 5–25                          | 4–20                                       |
| French Oil Mill Machinery | 10–30                         | 8–24                                       |

### Pneumatic Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Ingersoll Rand            | 2–10                          | 1.6–8                                      |
| Atlas Copco               | 1.5–15                        | 1.2–12                                     |
| Kaeser Compressors        | 2–12                          | 1.6–9.6                                    |
| Gardner Denver            | 2–8                           | 1.6–6.4                                    |
| Quincy Compressors        | 1–10                          | 0.8–8                                      |
| Elgi Equipments           | 1–8                           | 0.8–6.4                                    |
| Festo                     | 0.5–5                         | 0.4–4                                      |
| SMC Corporation           | 0.5–3                         | 0.4–2.4                                    |
| Bimba Manufacturing       | 1–6                           | 0.8–4.8                                    |
| Parker Hannifin           | 1–8                           | 0.8–6.4                                    |

### Drilling Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Makita                    | 0.5–2                         | 0.4–1.6                                    |
| Bosch                     | 0.3–1.5                       | 0.24–1.2                                   |
| DeWalt                    | 0.4–2.5                       | 0.32–2                                     |
| Hilti                     | 0.5–3                         | 0.4–2.4                                    |
| Black & Decker            | 0.2–1                         | 0.16–0.8                                   |
| Hitachi (HiKOKI)          | 0.5–2                         | 0.4–1.6                                    |
| Atlas Copco               | 2–8                           | 1.6–6.4                                    |
| FEIN                      | 1–5                           | 0.8–4                                      |
| Metabo                    | 0.5–3                         | 0.4–2.4                                    |
| Craftsman                 | 0.2–1                         | 0.16–0.8                                   |

### Forging Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| SMS group                 | 50–500                        | 40–400                                     |
| Schuler Group             | 30–300                        | 24–240                                     |
| Ajax-CECO                 | 20–150                        | 16–120                                     |
| Komatsu                   | 50–400                        | 40–320                                     |
| Lasco Umformtechnik       | 40–300                        | 32–240                                     |
| Erie Press Systems        | 20–150                        | 16–120                                     |
| J&H Press                 | 30–200                        | 24–160                                     |
| NHI Group                 | 50–500                        | 40–400                                     |
| Fagor Arrasate            | 30–250                        | 24–200                                     |
| Mitsubishi Heavy Industries | 50–600                     | 40–480                                     |

### Injection Molding Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Arburg                    | 5–40                          | 4–32                                       |
| ENGEL                     | 10–80                         | 8–64                                       |
| Husky Injection Molding Systems | 20–100                 | 16–80                                      |
| KraussMaffei              | 15–50                         | 12–40                                      |
| Sumitomo (SHI) Demag      | 10–60                         | 8–48                                       |
| Milacron                  | 10–80                         | 8–64                                       |
| Chen Hsong                | 10–60                         | 8–48                                       |
| Nissei Plastic Industrial Co. | 5–30                    | 4–24                                       |
| Toshiba Machine           | 10–40                         | 8–32                                       |
| Fanuc                     | 10–50                         | 8–40                                       |

### Threading Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| KMT (Kleine Maschinen Technik) | 1.5–5                   | 1.2–4                                      |
| TIBO Maschinenbau         | 2–8                           | 1.6–6.4                                    |
| Mazak                     | 5–15                          | 4–12                                       |
| Larsen & Toubro           | 3–10                          | 2.4–8                                      |
| Jones & Shipman           | 2–6                           | 1.6–4.8                                    |
| Schutte                   | 3–12                          | 2.4–9.6                                    |
| Toshiba Machine           | 2–8                           | 1.6–6.4                                    |
| SIP (Société Industrielle de Production) | 1–5           | 0.8–4                                      |
| CNC Masters               | 1–5                           | 0.8–4                                      |
| WMW Machinery             | 3–10                          | 2.4–8                                      |

### Laser Cutting Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Trumpf                    | 4–30                          | 3.2–24                                     |
| Amada                     | 3–20                          | 2.4–16                                     |
| Bystronic                 | 5–25                          | 4–20                                       |
| Mitsubishi Electric       | 6–25                          | 4.8–20                                     |
| LVD                       | 4–20                          | 3.2–16                                     |
| Han's Laser               | 4–30                          | 3.2–24                                     |
| IPG Photonics             | 10–40                         | 8–32                                       |
| Prima Power               | 4–25                          | 3.2–20                                     |
| Cincinnati Incorporated   | 6–25                          | 4.8–20                                     |
| Laserline                 | 5–30                          | 4–24                                       |

### EDM Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Sodick                    | 5–30                          | 4–24                                       |
| Makino                    | 6–40                          | 4.8–32                                     |
| AgieCharmilles (GF Machining Solutions) | 5–25           | 4–20                                       |
| Mitsubishi Electric       | 5–30                          | 4–24                                       |
| Charmilles                | 6–20                          | 4.8–16                                     |
| Exeron                    | 3–15                          | 2.4–12                                     |
| Emco                      | 4–25                          | 3.2–20                                     |
| Ona Electroerosion        | 4–25                          | 3.2–20                                     |
| Mitsui Seiki              | 4–20                          | 3.2–16                                     |
| FANUC                     | 5–35                          | 4–28                                       |

### Extrusion Machines
| Manufacturer              | Power Consumption (kW)         | Carbon Emission Factor (kg CO₂/hour)         |
|---------------------------|-------------------------------|---------------------------------------------|
| Coperion                  | 50–250                        | 40–200                                     |
| KraussMaffei              | 40–200                        | 32–160                                     |
| Battenfeld-Cincinnati     | 30–150                        | 24–120                                     |
| Leistritz                 | 50–180                        | 40–144                                     |
| The Davis-Standard Company | 60–250                      | 48–200                                     |
| W&H Group                 | 40–150                        | 32–120                                     |
| Milacron                  | 50–200                        | 40–160                                     |
| NFM Welding Engineers     | 60–300                        | 48–240                                     |
| Berstorff                 | 40–180                        | 32–144                                     |
| JSW (Japan Steel Works)   | 50–200                        | 40–160                                     |


### Workpiece Material Emission Factors

| Material     | CEm  | CEchip |
|--------------|------|--------|
| steel        | 2    | 0.357  |
| aluminum     | 4.1  | 2      |
| copper       | 4.1  | 1.5    |
| titanium     | 13.5 | 4.5    |
| zinc         | 3.5  | 0.3    |
| cement       | 0.9  | 0.5    |
| glass        | 0.65 | 1.3    |
| plastics     | 7.5  | 1.2    |
| wood         | 0.25 | 0.35   |
| lead         | 3.5  | 4      |
| cast iron    | 2    | 1.5    |
| mild steel   | 1.36 | 2.5    |


### Coolant Emission Factors

| Coolant Type     | Lifetime (years) | Carbon Emission Factor (CEF) |
|------------------|------------------|------------------------------|
| Mineral based    | 8                | 2                            |
| Synthetic        | 10               | 2.5                          |
| Semi synthetic   | 8                | 2                            |
| Bio based        | 5                | 1                            |
| Water soluble    | 10               | 0.5                          |

### Waste Coolant Emission Factors

| Disposal Method  | Carbon Emission Factor (CEwc) |
|------------------|-------------------------------|
| Recycle          | 0.35                          |
| Incineration     | 1.25                          |
| Landfilling      | 0.1                           |
| Waste coolant    | 1.5                           |

