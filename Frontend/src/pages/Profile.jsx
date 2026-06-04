import { useState } from "react";
import API from "../services/api";

function Profile() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token =
      localStorage.getItem("token");

    const res = await API.put(
      "/user/profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Profile Updated");

    console.log(res.data);
  } catch (error) {
    console.log(error);
    alert("Error updating profile");
  }
};
  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-lg w-[400px]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Complete Your Profile
        </h2>

        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <select
          name="gender"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <select
          name="goal"
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="">Select Goal</option>
          <option value="Weight Loss">
            Weight Loss
          </option>
          <option value="Muscle Gain">
            Muscle Gain
          </option>
          <option value="Maintain Weight">
            Maintain Weight
          </option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;