export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Step {
  title: string;
  description: string;
  estimatedCost?: string;
  requiredDocuments?: string[];
}

export interface Roadmap {
  eligibilityStatus: 'Likely Eligible' | 'Likely Ineligible' | 'Complex/Uncertain';
  summary: string;
  steps: Step[];
}

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];