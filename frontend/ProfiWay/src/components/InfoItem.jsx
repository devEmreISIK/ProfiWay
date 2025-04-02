
export const InfoItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );