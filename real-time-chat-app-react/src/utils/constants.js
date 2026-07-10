export const categories = ["Academics", "Placement", "Hostel", "Events", "Sports", "Exams", "General"];

export const priorities = ["Normal", "Important", "Emergency"];

export const departments = [
  { name: "Computer Science and Engineering", shortForm: "CSE" },
  { name: "Information Science and Technology", shortForm: "IST" },
  { name: "Electronics and Communication Engineering", shortForm: "ECE" },
  { name: "Electrical and Electronics Engineering", shortForm: "EEE" },
  { name: "Mechanical Engineering", shortForm: "MECH" },
  { name: "Civil Engineering", shortForm: "CIVIL" },
  { name: "Industrial Engineering", shortForm: "INDUS" },
  { name: "Manufacturing Engineering", shortForm: "MFG" },
  { name: "Material Science and Engineering", shortForm: "MSE" },
  { name: "Mining Engineering", shortForm: "MINING" },
  { name: "Printing Technology", shortForm: "PT" },
  { name: "Biomedical Engineering", shortForm: "BME" },
  { name: "Agricultural Engineering", shortForm: "AGRI" },
  { name: "Geoinformatics Engineering", shortForm: "GEO" },
];

export const registrationDepartments = [
  { name: "All", shortForm: "All", label: "All (Admin)" },
  ...departments,
];

export const emptyAnnouncement = {
  title: "",
  description: "",
  category: "General",
  priority: "Normal",
  targetRoom: "All",
};
