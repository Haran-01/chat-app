const StatCard = ({ label, value, icon }) => {
  const IconComponent = icon;

  return (
    <div className="stat-card">
      <div className="stat-icon">
        <IconComponent size={18} strokeWidth={2} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
};

export default StatCard;
