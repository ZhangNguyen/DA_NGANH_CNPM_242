import SharedDevice from "../models/SharedDevice";
import axios from "axios";

export const fetchSharedDevicesFromAdafruit = async (user: any) => {
  try {
    const { adafruit_username, adafruit_key } = user;
    const res = await axios.get(`https://io.adafruit.com/api/v2/${adafruit_username}/feeds`, {
      headers: { "X-AIO-Key": adafruit_key },
    });

    const feeds = res.data;
    for (const feed of feeds) {
      let type: string | null = null;
      const name = feed.name.toLowerCase();

      if (name.includes("fan")) type = "fan_level";
      else if (name.includes("rgb")) type = "RGB";
      else if (name.includes("light")) type = "light";

      if (!type) continue;

      const latestData = await axios.get(
        `https://io.adafruit.com/api/v2/${adafruit_username}/feeds/${feed.key}/data/last`,
        { headers: { "X-AIO-Key": adafruit_key } }
      );

      await SharedDevice.findOneAndUpdate(
        { _id: latestData.data.feed_id },
        {
          _id: latestData.data.feed_id,
          type: type,
          value: parseFloat(latestData.data.value),
          feed_key: feed.key,
          name: feed.name,
          user: user.id,
        },
        { upsert: true, new: true }
      );
    }

    return { status: "success", message: "Shared devices fetched" };
  } catch (err: any) {
    console.error("❌ Error fetching shared devices:", err.message);
    throw new Error("Failed to fetch shared devices from Adafruit");
  }
};

export const getSharedDevicesByUser = async (user: any) => {
  try {
    await fetchSharedDevicesFromAdafruit(user);
    return await SharedDevice.find({ user: user.id });
  } catch (err: any) {
    throw new Error("Failed to get shared devices");
  }
};

export const getSharedDeviceById = async (id: string) => {
  return await SharedDevice.findOne({ _id: id });
};
