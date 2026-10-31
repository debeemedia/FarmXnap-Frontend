import type { ApiLink } from "./common";

export type Treatment = {
  id: string;
  name: string;
  active_ingredient: string;
  price: string;
  stock_quantity: number;
  unit: string;
  description: string;
  target_problems: string;
  category: string;
  business_name: string;
  business_address: string;
  lga: string;
  state: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  phone_number: string;
  rank: number;
  links: Record<string, ApiLink>;
};

export type Diagnosis = {
  crop: string;
  instructions: string;
  // `disease` is not returned for healthy crop.
  disease?: string | null;
};

export type CropScanResponse = {
  data: {
    diagnosis: Diagnosis;
    // `treatments` is not returned for healthy crop. Note that `treatments` can be an empty array for diseased crop with no treatments found.
    treatments?: Treatment[];
  };
};
