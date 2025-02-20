const Machine = require('../models/Machine');
const mongoose = require('mongoose');

class CalculationService {
    // Calculate Electrical Emission (CEele)
    static async calculateCEelec(machineType, brand, ) {
        // Fetch the machine data based on type and brand
        const machine = await Machine.findOne({ type: machineType, manufacturer: brand });
        if (!machine) {
            throw new Error(`Machine of type ${machineType} and brand ${brand} not found.`);
        }
        return machine.emissionFactor;
    }

    // Calculate Tool Emission (CEtool)
    static calculateCEtool(runTime, toolMaterial, toolMass) {
        const toolFactors = {
            'High-Speed Steel (HSS)': { CEFtool: 33.75, Ttool: 45 },
            'Uncoated Carbide': { CEFtool: 29.6, Ttool: 90 },
            'Coated Carbide': { CEFtool: 31, Ttool: 120 },
            'Cermet': { CEFtool: 27, Ttool: 150 },
            'Ceramic Tools': { CEFtool: 25, Ttool: 180 },
            'Polycrystalline Cubic Boron Nitride (PCBN)': { CEFtool: 50, Ttool: 300 },
            'Polycrystalline Diamond (PCD)': { CEFtool: 50, Ttool: 300 },
            'High-Performance Coated HSS': { CEFtool: 34, Ttool: 60 },
            'Nano-Composite Tools': { CEFtool: 30, Ttool: 130 },
            'Tungsten Carbide with Reduced Cobalt': { CEFtool: 28, Ttool: 110 },
            'Ultra-Hard Composite Tools': { CEFtool: 32, Ttool: 140 },
            'Sintered Diamond Tools': { CEFtool: 48, Ttool: 290 },
            'Binderless Tungsten Carbide': { CEFtool: 29, Ttool: 115 },
            'Electroplated Carbide Tools': { CEFtool: 30.5, Ttool: 100 },
            'High Purity Ceramic Composite Tools': { CEFtool: 26, Ttool: 170 },
            'Titanium Carbide Tools': { CEFtool: 32.5, Ttool: 125 },
            'Vanadium Alloyed Carbide Tools': { CEFtool: 30, Ttool: 115 },
            'Cobalt-Free Carbide Tools': { CEFtool: 27.5, Ttool: 100 },
            'Hardfacing Coated Tools (Tungsten-Based)': { CEFtool: 33, Ttool: 95 },
            'Gradient Coating Carbide Tools': { CEFtool: 31.5, Ttool: 130 },
            'Nanostructured HSS Tools': { CEFtool: 32, Ttool: 55 },
            'Multi-layer Coated Carbide Tools (TiCN/TiAIN)': { CEFtool: 30, Ttool: 135 },
            'PCD with Metal Matrix Bonding': { CEFtool: 52, Ttool: 310 },
            'PCD with Resin Bonding': { CEFtool: 48, Ttool: 280 },
            'Diamond-like Carbon (DLC) Coated Tools (on HSS)': { CEFtool: 34.5, Ttool: 70 },
            'Bulk CBN Tools': { CEFtool: 36, Ttool: 220 },
            'Sintered cBN Tools with Binder': { CEFtool: 35.5, Ttool: 190 },
            'Recycled Carbide Tools': { CEFtool: 25, Ttool: 100 },
            'Advanced Ultra-Hard Nanocomposite Tools': { CEFtool: 28.5, Ttool: 100 }
        };

        const { CEFtool, Ttool } = toolFactors[toolMaterial];
        return (runTime /(Ttool*60)) * CEFtool * toolMass;
    }

    // Calculate Coolant Emission (CEcoolant)
    static calculateCEcoolant(runTime, coolantType, disposalMethod) {
        const coolantFactors = {
            'Water-Based': { lifetime: 10, CEFcoolant: 0.2 },
            'Oil-Based': { lifetime: 10, CEFcoolant: 2.85 },
            'Synthetic Coolant': { lifetime: 10, CEFcoolant: 3 },
            'Semi-Synthetic': { lifetime: 8, CEFcoolant: 2 },
            'Vegetable-Based': { lifetime: 5, CEFcoolant: 1.5 }

        };

        const disposalFactors = {
            'Recycle': 0.35,
            'Incineration': 1.25,
            'Landfill': 0.1,
            'Waste Coolant': 1.5
        };

        const { lifetime, CEFcoolant } = coolantFactors[coolantType];
        const CEFwc = disposalFactors[disposalMethod];

         const CEoil = CEFcoolant ;
         const CEwc = CEFwc;// * 260;

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

        const CEFm = materialFactors[material]; // Default to 0 if material not found
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

        const CEFchip = chipFactors[material]; // Default to 0 if material not found
        return CEFchip * mass;
    }

    // Calculate Total Emission
    static async calculateRegularTotalEmission(params) {
        // Log the parameters for debugging
        console.log('Calculating total emission with parameters:', params);

        // Validate required parameters
        const requiredParams = ['machineType', 'brand', 'toolMaterial', 'toolMass', 'runTime', 'coolantType', 'disposalMethod', 'material', 'chipMass'];
        for (const param of requiredParams) {
            if (!params[param]) {
                throw new Error(`Missing required parameter: ${param}`);
            }
        }

        // Convert parameters to floats
        const toolMass = parseFloat(params.toolMass);
        const runTime = parseFloat(params.runTime);
        const chipMass = parseFloat(params.chipMass) || 0; // Default to 0 if empty

        // Ensure all required parameters are valid numbers
        if (isNaN(chipMass)){
            throw new Error('Invalid input: chipMass');
        }
        if (isNaN(runTime)){
            throw new Error('Invalid input:  runTime');
        }
        if (isNaN(toolMass)){
            throw new Error('Invalid input:  toolMass');
        }

        const CEelec = await this.calculateCEelec(params.machineType, params.brand);
        const CEtool = this.calculateCEtool(runTime, params.toolMaterial, toolMass);
        const CEcoolant = this.calculateCEcoolant(runTime, params.coolantType, params.disposalMethod);
        const CEm = this.calculateCEm(params.material, chipMass);
        const CEchip = this.calculateCEchip(params.material, chipMass);
        const total = CEelec + CEtool + CEcoolant + CEm + CEchip;

        return {
            CEelec,
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
            'pu', 'pi', 'tidle', 'dw', 'Lw', 'machiningAllowance', 'vc', 'f', 'ap',
            'coolantType', 'CC', 'AC', 'coolantConcentration', 'toolMaterial', 'toolMass', 'material'
        ];
        const numParams = [
            'pu', 'pi', 'tidle', 'dw', 'Lw', 'machiningAllowance', 'vc', 'f', 'ap','toolMass','CC', 'AC', 'coolantConcentration'
        ];

        for (const key in numParams) {
            if (!isNaN(numParams[key])&&numParams[key]!== "") {
                numParams[key] = parseFloat(numParams[key]);
        }
    }
        for (const param of requiredParams) {
            if (params[param] === undefined || params[param] === null) {
                throw new Error(`Missing required parameter: ${param}`);
            }
        }

        // Calculate tc
        const { dw, Lw, machiningAllowance, vc, f, ap } = params;
        const tc = (3.14 * dw * Lw * machiningAllowance) / (1000 * vc * f * ap); 
        

        // Calculate ECmachine
        const { pu, tidle, pi } = params;
        const ECmachine = ((pu * tidle) / 3600) + ((pi * tc) / 3600);

        // Calculate CEelec
        const CEFelec = 0.7082; // Constant for electrical emission factor
        const CEelec = CEFelec * ECmachine;

        // Calculate T and CEcoolant
        const T = tc + tidle;
        const Tcoolant = 2 * 30 * 24 * 60 * 60; // 2 months in seconds

        // Fetch coolant factors based on selected type
        const coolantFactors = {
            'Water-Based': { CEFoil: 0.2, CEFwc: 0.1 },
            'Oil-Based': { CEFoil: 2.85, CEFwc: 0.5 },
            'Synthetic Coolant': { CEFoil: 3, CEFwc: 0.7 },
            'Semi-Synthetic': { CEFoil: 2, CEFwc: 0.4 },
            'Vegetable-Based': { CEFoil: 1.5, CEFwc: 0.3 }

        };
        let { CC, AC, coolantConcentration } = params;
        const { CEFoil, CEFwc } = coolantFactors[params.coolantType];

        CC = parseFloat(CC);
        AC = parseFloat(AC);

        // Calculate CEoil and CEwc
        const CEoil = CEFoil * (CC + AC);
        const CEwc = CEFwc * ((CC + AC) / coolantConcentration);
        const CEcoolant = (T / Tcoolant) * (CEoil + CEwc);

        // Calculate CEtool
        const { toolMaterial, toolMass } = params;
        const CEtool = this.calculateCEtool(tc, toolMaterial, toolMass);

        // Calculate CEm
        const CEFce = 2.47; // Carbon emission factor of coal
        const materialFactors = {
            'Aluminum (primary production)': { EEce: 13.1, ECce: 1.3, density: 2.7 },
            'Aluminum (recycled)': { EEce: 13, ECce: 0.2, density: 2.7 },
            'Stainless Steel': { EEce: 4.18, ECce: 0.7, density: 2.7 },
            'Steel (general)': { EEce: 2.87, ECce: 1.4, density: 7.8 },
            'Steel (recycled)': { EEce: 1.9, ECce: 0.3, density: 7.8 },
            'Copper (primary production)': { EEce: 3.67, ECce: 2.3, density: 8.9 },
            'Copper (recycled)': { EEce: 1.2, ECce: 0.3, density: 8.9 },
            'Zinc (primary production)': { EEce: 4.18, ECce: 2, density: 7.14 },
            'Zinc (recycled)': { EEce: 0.52, ECce: 0.25, density: 7.14 },
            'Lead (primary production)': { EEce: 3.37, ECce: 0.8, density: 11.3 },
            'Lead (recycled)': { EEce: 0.58, ECce: 0.2, density: 11.3 },
            'Glass (virgin production)': { EEce: 1.533, ECce: 0.4, density: 2.5 },
            'Glass (recycled)': { EEce: 1.25, ECce: 0.05, density: 2.5 },
            'Cement': { EEce: 0.82, ECce: 0.5, density: 1.5 },
            'Concrete': { EEce: 1.88, ECce: 0.25, density: 2.3 },
            'Brick': { EEce: 0.45, ECce: 0.3, density: 1.8 },
            'Lime': { EEce: 0.78, ECce: 0.6, density: 1.4 },
            'Sand': { EEce: 0.008, ECce: 0.005, density: 1.6 },
            'Gravel': { EEce: 0.78, ECce: 0.0025, density: 1.5 },
            'Timber': { EEce: -1.27, ECce: 0.5, density: 0.4 },
            'Plywood': { EEce: 0.681, ECce: 0.3, density: 0.7 },
            'Medium-Density Fiberboard': { EEce: 0.856, ECce: 0.7, density: 0.6 },
            'Polyethylene (PE)': { EEce: 2.34, ECce: 1, density: 0.91 },
            'Polypropylene (PP)': { EEce: 4.2, ECce: 1.2, density: 0.85 },
            'Polyvinyl Chloride (PVC)': { EEce: 3.23, ECce: 1.4, density: 1.3 },
            'Polystyrene': { EEce: 3.43, ECce: 1.5, density: 1.05 },
            'Polyethylene Terephthalate (PET)': { EEce: 5.56, ECce: 1.2, density: 1.37 },
            'Nylon': { EEce: 6.7, ECce: 1.7, density: 1.14 },
            'Polyurethane (rigid foam)': { EEce: 3.76, ECce: 1.8, density: 0.03 },
            'Expanded Polystyrene (EPS)': { EEce: 4.98, ECce: 1.6, density: 0.02 }
        };
        const materialData = materialFactors[params.material];
        const { density } = materialData;
        const CEFm = materialData.EEce * CEFce;
        const Mchip = vc * ap * f * tc * density / 1000; // Convert vc to m/s
        const CEm = CEFm * Mchip;

        // Calculate CEchip
        const CEFchip = CEFce * materialData.ECce; // Using ECce for chip emission calculation
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
        };
    }

    // Validate machineId
    static async validateMachineId(machineId) {
        if (!mongoose.Types.ObjectId.isValid(machineId)) {
            throw new Error('Invalid machine ID');
        }

        const machine = await Machine.findById(machineId);
        if (!machine) {
            throw new Error('Machine not found');
        }
    }
}

module.exports = CalculationService; 