import axios from "axios";

export default async function extractNPTextFromImage(filename, blob) {
  const formData = new FormData();
  formData.append("image", blob, filename);
  formData.append("token", "token");

  const response = await axios.post("http://localhost:3001", formData);
  const data = response.data;
  return data.area + " " + data.number;
}
