const Machine = require('../models/Machine');

class CalculationService {
    // Calculate Electrical Emission (CEele)
    static async calculateCEele(machineType, brand, hours) {
        // Fetch the machine data based on type and brand
        const machine = await Machine.findOne({ type: machineType, manufacturer: brand });
        if (!machine) {
            throw new Error(`Machine of type ${machineType} and brand ${brand} not found.`);
        }
        return machine.emissionFactor * hours;
    }

    // Calculate Tool Emission (CEtool)
    static calculateCEtool(runTime, toolMaterial, toolMass) {
        const toolFactors = {
            'High-Speed Steel (HSS)': { CFm: 33.75, Ttool: 45 },
            'Uncoated Carbide': { CFm: 29.6, Ttool: 90 },
            'Coated Carbide': { CFm: 31, Ttool: 120 },
            'Cermet': { CFm: 27, Ttool: 150 },
            'Ceramic Tools': { CFm: 25, Ttool: 180 },
            'PCBN': { CFm: 50, Ttool: 200 },
            'Polycrystalline Diamond (PCD)': { CFm: 50, Ttool: 200 },
            'High-Performance Coated HSS': { CFm: 34, Ttool: 60 },
            'Nano-Composite Tools': { CFm: 30, Ttool: 130 },
            'Tungsten Carbide with Reduced Cobalt': { CFm: 28, Ttool: 110 },
            'Ultra-Hard Composite Tools': { CFm: 32, Ttool: 140 },
            'Sintered Diamond Tools': { CFm: 48, Ttool: 290 },
            'Binderless Tungsten Carbide': { CFm: 29, Ttool: 115 },
            'Electroplated Carbide Tools': { CFm: 30.5, Ttool: 150 },
            'High Purity Ceramic Composite Tools': { CFm: 26, Ttool: 170 },
            'Titanium Carbide Tools': { CFm: 32.5, Ttool: 125 },
            'Vanadium Alloyed Carbide Tools': { CFm: 30, Ttool: 115 },
            'Cobalt-Free Carbide Tools': { CFm: 27.5, Ttool: 100 },
            'Hardfacing Coated Tools (Tungsten-Based)': { CFm: 33, Ttool: 95 },
            'Gradient Coating Carbide Tools': { CFm: 31.5, Ttool: 130 },
            'Nanostructured HSS Tools': { CFm: 32, Ttool: 55 },
            'Multi-layer Coated Carbide Tools (TiCN/TiAIN)': { CFm: 30, Ttool: 140 },
            'PCD with Metal Matrix Bonding': { CFm: 52, Ttool: 280 },
            'PCD with Resin Bonding': { CFm: 48, Ttool: 280 },
            'Diamond-like Carbon (DLC) Coated Tools (on HSS)': { CFm: 34.5, Ttool: 55 },
            'Bulk CBN Tools': { CFm: 36, Ttool: 220 },
            'Sintered cBN Tools with Binder': { CFm: 35.5, Ttool: 110 },
            'Recycled Carbide Tools': { CFm: 25, Ttool: 100 },
            'Advanced Ultra-Hard Nanocomposite Tools': { CFm: 28.5, Ttool: 100 }
        };

        const { CFm, Ttool } = toolFactors[toolMaterial] || toolFactors['High-Speed Steel (HSS)'];
        return (runTime / Ttool) * CFm * toolMass;
    }

    // Calculate Coolant Emission (CEcoolant)
    static calculateCEcoolant(runTime, coolantType, disposalMethod) {
        const coolantFactors = {
            'Water-Based': { lifetime: 10, CEFcoolant: 0.2 },
            'Oil-Based': { lifetime: 10, CEFcoolant: 2.85 },
            'Synthetic Coolant': { lifetime: 10, CEFcoolant: 3 },
            'Semi-Synthetic': { lifetime: 10, CEFcoolant: 2 },
            'Vegetable-Based': { lifetime: 10, CEFcoolant: 1.5 }
        };

        const disposalFactors = {
            'Recycle': 0.35,
            'Incineration': 1.25,
            'Landfill': 0.1,
            'Waste Coolant': 1.5,
            'Bio-based': 0.5,
            'Bio-based Water-soluble': 0.5
        };

        const { lifetime, CEFcoolant } = coolantFactors[coolantType] || coolantFactors['Water-Based'];
        const CEFwc = disposalFactors[disposalMethod] || disposalFactors['Recycle'];

        const CEoil = CEFcoolant * 13;
        const CEwc = CEFwc * 260;

        return (runTime / lifetime) * (CEoil + CEwc);
    }

    // Calculate Material Emission (CEm)
    static calculateCEm(material, mass) {
        const materialFactors = {
            'Aluminum (primary production)': 11.89,
            'Aluminum (recycled)': 2.01,
            'Stainless Steel': 6.15,
            'Steel (general)': 1.77,
            'Steel (recycled)': 0.88,
            'Copper (primary production)': 3.83,
            'Copper (recycled)': 2.77,
            'Zinc (primary production)': 3.86,
            'Zinc (recycled)': 0.48,
            'Lead (primary production)': 2.61,
            'Lead (recycled)': 0.53,
            'Glass (virgin production)': 4.4,
            'Glass (recycled)': 0.73,
            'Cement': 0.89,
            'Concrete': 0.15,
            'Brick': 0.24,
            'Lime': 0.74,
            'Sand': 0.01,
            'Gravel': 0.0048,
            'Timber': 0.46,
            'Plywood': 1.07,
            'Medium-Density Fiberboard': 0.72,
            'Polyethylene (PE)': 2.4,
            'Polypropylene (PP)': 1.95,
            'Polyvinyl Chloride (PVC)': 2.22,
            'Polystyrene': 3.07,
            'Polyethylene Terephthalate (PET)': 5.44,
            'Nylon': 7.9,
            'Polyurethane (rigid foam)': 3.61,
            'Expanded Polystyrene (EPS)': 2.55,
        };

        const CEFm = materialFactors[material] || 0; // Default to 0 if material not found
        return CEFm * mass;
    }

    // Calculate Chip Emission (CEchip)
    static calculateCEchip(material, mass) {
        const chipFactors = {
            'Aluminum (primary production)': 1.23,
            'Aluminum (recycled)': 0.56,
            'Stainless Steel': 0.77,
            'Steel (general)': 0.5,
            'Steel (recycled)': 0.3,
            'Copper (primary production)': 0.6,
            'Copper (recycled)': 0.32,
            'Zinc (primary production)': 0.53,
            'Zinc (recycled)': 0.23,
            'Lead (primary production)': 0.42,
            'Lead (recycled)': 0.21,
            'Glass (virgin production)': 0.6,
            'Glass (recycled)': 0.27,
            'Cement': 0.3,
            'Concrete': 0.159,
            'Brick': 0.24,
            'Lime': 0.21,
            'Sand': 0.0001,
            'Gravel': 0,
            'Timber': 0,
            'Plywood': 0.09,
            'Medium-Density Fiberboard': 0.3,
            'Polyethylene (PE)': 0.7,
            'Polypropylene (PP)': 0.5,
            'Polyvinyl Chloride (PVC)': 0.432,
            'Polystyrene': 0.55,
            'Polyethylene Terephthalate (PET)': 0.44,
            'Nylon': 0.23,
            'Polyurethane (rigid foam)': 0.81,
            'Expanded Polystyrene (EPS)': 0.33,
        };

        const CEFchip = chipFactors[material] || 0; // Default to 0 if material not found
        return CEFchip * mass;
    }

    // Calculate Total Emission
    static async calculateTotalEmission(params) {
        // Log the parameters for debugging
        console.log('Calculating total emission with parameters:', params);

        // Validate required parameters
        const requiredParams = ['machineType', 'brand', 'hours', 'toolMaterial', 'toolMass', 'runTime', 'coolantType', 'disposalMethod', 'material', 'chipMass'];
        for (const param of requiredParams) {
            if (!params[param]) {
                throw new Error(`Missing required parameter: ${param}`);
            }
        }

        const CEele = await this.calculateCEele(params.machineType, params.brand, params.hours);
        const CEtool = this.calculateCEtool(params.runTime, params.toolMaterial, params.toolMass);
        const CEcoolant = this.calculateCEcoolant(params.runTime, params.coolantType, params.disposalMethod);
        const CEm = this.calculateCEm(params.material, params.chipMass);
        const CEchip = this.calculateCEchip(params.material, params.chipMass);
        const total = CEele + CEtool + CEcoolant + CEm + CEchip;

        return {
            CEele,
            CEtool,
            CEcoolant,
            CEm,
            CEchip,
            total
        };
    }

    // New method: Calculate Industrial Total Emission using detailed input parameters
    static async calculateIndustrialTotalEmission(params) {
        // Validate required industrial parameters
        const requiredParams = [
            'machineId', 'pu', 'pi', 'tidle', 'dw', 'Lw', 'machiningAllowance',
            'vc', 'f', 'ap', 'coolantType', 'CC', 'AC', 'coolantConcentration',
            'toolMaterial', 'toolMass', 'material'
        ];
        for (const param of requiredParams) {
            if (params[param] === undefined) {
                throw new Error(`Missing required parameter: ${param}`);
            }
        }

        // Fetch the machine record to retrieve the electrical emission factor (CEFelec)
        const machine = await Machine.findById(params.machineId);
        if (!machine) {
            throw new Error(`Machine with id ${params.machineId} not found.`);
        }

        // Destructure parameters with descriptive variable names
        const {
            pu, // Standby power (Watts)
            pi, // Operational power (Watts)
            tidle, // Idle time (seconds)
            dw, // Workpiece diameter
            Lw, // Workpiece length
            machiningAllowance, // Machining allowance (Δ)
            vc, // Cutting velocity
            f, // Feed rate
            ap, // Depth of cut
            coolantType,
            CC, // Initial volume of cutting fluid
            AC, // Additional volume of cutting fluid
            coolantConcentration, // Coolant concentration (δ)
            toolMaterial,
            toolMass,
            material
        } = params;

        // 1. Calculate cutting time (tc)
        // tc = (π * dw * Lw * machiningAllowance) / (1000 * vc * f * ap)
        const tc = (Math.PI * dw * Lw * machiningAllowance) / (1000 * vc * f * ap);

        // 2. Calculate Machine Energy Consumption (ECmachine)
        // ECmachine = (standby power * idle time) + (operating power * cutting time)
        const ECmachine = (pu * tidle) + (pi * tc);

        // 3. Calculate Electrical Emission (CEelec)
        // Using machine.emissionFactor as CEFelec
        const CEelec = machine.emissionFactor * ECmachine;

        // 4. Calculate Coolant Emission (CEcoolant)
        // Total operating time = cutting time + idle time
        const totalOperatingTime = tc + tidle;
        // Tcoolant = 2 months in seconds
        const Tcoolant = 2 * 30 * 24 * 60 * 60;
        // Define industrial coolant factors (using existing conventions)
        const industrialCoolantFactors = {
            'Mineral': { CEFoil: 2, CEFwc: 0.25 },
            'Synthetic': { CEFoil: 3, CEFwc: 0.3 }
        };
        const { CEFoil, CEFwc } = industrialCoolantFactors[coolantType] || industrialCoolantFactors['Mineral'];
        // Calculate emissions from the oil and water components:
        const CEoil = CEFoil * (CC + AC);
        const CEwc = CEFwc * ((CC + AC) / coolantConcentration);
        const CEcoolant = (totalOperatingTime / Tcoolant) * (CEoil + CEwc);

        // 5. Calculate Tool Emission (CEtool)
        // CEtool = (tc / Ttool) * CEFtool * toolMass
        const toolFactors = {
            'High-Speed Steel (HSS)': { CEFtool: 33.75, Ttool: 45 },
            'Uncoated Carbide': { CEFtool: 29.6, Ttool: 90 },
            'Coated Carbide': { CEFtool: 31, Ttool: 120 },
            'Cermet': { CEFtool: 27, Ttool: 150 },
            'Ceramic Tools': { CEFtool: 25, Ttool: 180 },
            'PCBN': { CEFtool: 50, Ttool: 200 },
            'Polycrystalline Diamond (PCD)': { CEFtool: 50, Ttool: 200 },
            'High-Performance Coated HSS': { CEFtool: 34, Ttool: 60 },
            'Nano-Composite Tools': { CEFtool: 30, Ttool: 130 },
            'Tungsten Carbide with Reduced Cobalt': { CEFtool: 28, Ttool: 110 },
            'Ultra-Hard Composite Tools': { CEFtool: 32, Ttool: 140 },
            'Sintered Diamond Tools': { CEFtool: 48, Ttool: 290 },
            'Binderless Tungsten Carbide': { CEFtool: 29, Ttool: 115 },
            'Electroplated Carbide Tools': { CEFtool: 30.5, Ttool: 150 },
            'High Purity Ceramic Composite Tools': { CEFtool: 26, Ttool: 170 },
            'Titanium Carbide Tools': { CEFtool: 32.5, Ttool: 125 },
            'Vanadium Alloyed Carbide Tools': { CEFtool: 30, Ttool: 115 },
            'Cobalt-Free Carbide Tools': { CEFtool: 27.5, Ttool: 100 },
            'Hardfacing Coated Tools (Tungsten-Based)': { CEFtool: 33, Ttool: 95 },
            'Gradient Coating Carbide Tools': { CEFtool: 31.5, Ttool: 130 },
            'Nanostructured HSS Tools': { CEFtool: 32, Ttool: 55 },
            'Multi-layer Coated Carbide Tools (TiCN/TiAIN)': { CEFtool: 30, Ttool: 140 },
            'PCD with Metal Matrix Bonding': { CEFtool: 52, Ttool: 280 },
            'PCD with Resin Bonding': { CEFtool: 48, Ttool: 280 },
            'Diamond-like Carbon (DLC) Coated Tools (on HSS)': { CEFtool: 34.5, Ttool: 55 },
            'Bulk CBN Tools': { CEFtool: 36, Ttool: 220 },
            'Sintered cBN Tools with Binder': { CEFtool: 35.5, Ttool: 110 },
            'Recycled Carbide Tools': { CEFtool: 25, Ttool: 100 },
            'Advanced Ultra-Hard Nanocomposite Tools': { CEFtool: 28.5, Ttool: 100 }
        };
        const toolData = toolFactors[toolMaterial] || toolFactors['High-Speed Steel (HSS)'];
        const CEtool = (tc / toolData.Ttool) * toolData.CEFtool * toolMass;

        // 6. Calculate Material Emission (CEm) and Chip Emission (CEchip)
        // For material, CEm = CEFm * Mchip,
        // where CEFm = (EEce * 2.47) and Mchip = (vc * ap * f * tc * density) / 1000.
        // Also, chip emission CEchip = (2.47 * ECce) * Mchip.
        const industrialMaterialFactors = {
            'Steel': { EEce: 0.5, density: 7.85, ECce: 1.2 },
            'Aluminum': { EEce: 0.3, density: 2.7, ECce: 1.0 }
            // Add more materials as needed
        };
        const materialData = industrialMaterialFactors[material] || industrialMaterialFactors['Steel'];
        const CEFm = materialData.EEce * 2.47;
        const Mchip = (vc * ap * f * tc * materialData.density) / 1000;
        const CEm = CEFm * Mchip;
        const CEFchip = 2.47 * materialData.ECce;
        const CEchip = CEFchip * Mchip;

        // Total emission
        const total = CEelec + CEtool + CEcoolant + CEm + CEchip;

        return {
            CEelec,
            CEtool,
            CEcoolant,
            CEm,
            CEchip,
            total,
            tc // Cutting time is returned for reference/debugging
        };
    }
}

module.exports = CalculationService; 