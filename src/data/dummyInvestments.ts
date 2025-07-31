export interface Investment {
  id: number;
  name: string;
  category: string;
  round: string;
  investedOn: string;
  amount: string;
  valuation: string;
  myInvestment: string;
  sharesAllocated: string;
  description: string;
  bgColor: string;
  textColor: string;
}

export const dummyInvestments: Investment[] = [
  {
    id: 1,
    name: "Infotech Pvt. Ltd.",
    category: "ED-TECH",
    round: "PRE-SEED",
    investedOn: "24th July, 2025",
    amount: "18Cr",
    valuation: "18.25Cr",
    myInvestment: "5L",
    sharesAllocated: "0.34%",
    description:
      "We are a Ed-tech company building CRM for local institutes lorem ipsum mininda...",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
  {
    id: 2,
    name: "HealthTech Solutions",
    category: "HEALTH-TECH",
    round: "SEED",
    investedOn: "15th June, 2025",
    amount: "12Cr",
    valuation: "25.5Cr",
    myInvestment: "8L",
    sharesAllocated: "0.42%",
    description:
      "Revolutionizing healthcare with AI-powered diagnostic solutions...",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  {
    id: 3,
    name: "FinWise Technologies",
    category: "FIN-TECH",
    round: "SEED",
    investedOn: "3rd May, 2025",
    amount: "15Cr",
    valuation: "22Cr",
    myInvestment: "6.5L",
    sharesAllocated: "0.29%",
    description:
      "Building next-gen financial planning tools for millennials...",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  {
    id: 4,
    name: "GreenEats",
    category: "FOOD-TECH",
    round: "PRE-SEED",
    investedOn: "12th August, 2025",
    amount: "8Cr",
    valuation: "10Cr",
    myInvestment: "3L",
    sharesAllocated: "0.38%",
    description:
      "Sustainable food delivery platform focusing on zero-waste packaging...",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  {
    id: 5,
    name: "SpaceView Inc.",
    category: "SPACE-TECH",
    round: "SERIES-A",
    investedOn: "1st September, 2025",
    amount: "35Cr",
    valuation: "120Cr",
    myInvestment: "12L",
    sharesAllocated: "0.10%",
    description:
      "Democratizing access to satellite imagery for businesses and researchers...",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
];

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
