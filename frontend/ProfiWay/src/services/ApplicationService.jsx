// services/applicationService.js
import axios from "axios";

export const applyToJob = async (user, jobPostingId) => {
  const response = await axios.post(
    "https://localhost:7198/api/Applications/add",
    {
      userId: user.id,
      jobPostingId: jobPostingId,
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  return response.data;
};
