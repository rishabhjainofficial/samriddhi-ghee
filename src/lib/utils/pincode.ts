export interface IPincodeDetails {
  city: string;
  state: string;
}

// Curated database for major Indian pin ranges and metro hubs
const PINCODE_PREFIX_MAP: Record<string, IPincodeDetails> = {
  // Delhi
  "11": { city: "New Delhi", state: "Delhi" },
  // Haryana
  "12": { city: "Gurugram / Faridabad", state: "Haryana" },
  // Punjab / Chandigarh
  "14": { city: "Ludhiana / Amritsar", state: "Punjab" },
  "16": { city: "Chandigarh", state: "Chandigarh" },
  // UP
  "20": { city: "Noida / Ghaziabad", state: "Uttar Pradesh" },
  "22": { city: "Lucknow", state: "Uttar Pradesh" },
  // Rajasthan
  "30": { city: "Jaipur", state: "Rajasthan" },
  "34": { city: "Jodhpur", state: "Rajasthan" },
  // Gujarat
  "38": { city: "Ahmedabad", state: "Gujarat" },
  "39": { city: "Surat / Vadodara", state: "Gujarat" },
  // Maharashtra
  "40": { city: "Mumbai", state: "Maharashtra" },
  "41": { city: "Pune", state: "Maharashtra" },
  // MP
  "45": { city: "Indore", state: "Madhya Pradesh" },
  "46": { city: "Bhopal", state: "Madhya Pradesh" },
  // Andhra / Telangana
  "50": { city: "Hyderabad", state: "Telangana" },
  "53": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  // Karnataka
  "56": { city: "Bengaluru", state: "Karnataka" },
  "57": { city: "Mangaluru / Mysuru", state: "Karnataka" },
  // Tamil Nadu
  "60": { city: "Chennai", state: "Tamil Nadu" },
  "64": { city: "Coimbatore", state: "Tamil Nadu" },
  // Kerala
  "68": { city: "Kochi / Ernakulam", state: "Kerala" },
  "69": { city: "Thiruvananthapuram", state: "Kerala" },
  // West Bengal
  "70": { city: "Kolkata", state: "West Bengal" },
  // Bihar
  "80": { city: "Patna", state: "Bihar" },
};

const SPECIFIC_PINCODES: Record<string, IPincodeDetails> = {
  "110001": { city: "New Delhi", state: "Delhi" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "500001": { city: "Hyderabad", state: "Telangana" },
};

export function lookupPincode(pincode: string): IPincodeDetails | null {
  const clean = pincode.trim().replace(/\D/g, "");
  if (clean.length !== 6) return null;

  if (SPECIFIC_PINCODES[clean]) {
    return SPECIFIC_PINCODES[clean];
  }

  const prefix = clean.substring(0, 2);
  if (PINCODE_PREFIX_MAP[prefix]) {
    return PINCODE_PREFIX_MAP[prefix];
  }

  return null;
}
