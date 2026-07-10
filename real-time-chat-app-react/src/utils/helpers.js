import { departments } from "./constants";

export const getDepartmentLabel = (shortForm) => {
  if (shortForm === "All") return "All Departments";

  const department = departments.find((item) => item.shortForm === shortForm);
  return department ? `${department.name} (${department.shortForm})` : shortForm;
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const formatRole = (role) => role.replace("_", " ").toUpperCase();

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
