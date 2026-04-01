import { backendAPI } from "./backendAPI";

export const getDominantColor = async (imageUrl: string): Promise<string> => {
  try {
    const res = await backendAPI.get(
      `/dominant-color?url=${encodeURIComponent(imageUrl)}`,
    );
    const data = res.data;
    return data.color ?? "#000000";
  } catch (error) {
    console.error("Error getting dominant color:", error);
    return "#000000";
  }
};
