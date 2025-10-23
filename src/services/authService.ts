import axios from "axios";

export interface LoginResponse {
  iduser: string;
  usertype: number;
  name: string;
  lastname: string;
  message: string;
  token: string;
}

export const loginUser = async (correo: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>("http://localhost:8080/api/login", {
    correo,
    password,
  });
  return response.data;
};
