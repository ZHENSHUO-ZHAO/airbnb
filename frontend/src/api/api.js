import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getRandomListings = async () => {
  try {
    const res = await axios.get(`${BASE_URL}randomListing`);
    return { data: res.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const searchListings = async (params) => {
  try {
    const res = await axios.get(`${BASE_URL}searchListing`, { params });
    return { data: res.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
