const express = require("express");
const router = express.Router();

router.get("/image", async (req, res) => {
  try {
    const destination = req.query.destination;

    if (!destination || !destination.trim()) {
      return res.status(400).json({
        message: "Destination is required",
      });
    }

    if (!process.env.PEXELS_API_KEY) {
      return res.status(500).json({
        message: "Image service is not configured",
      });
    }

    const query = encodeURIComponent(
      `${destination.trim()} travel landmark`
    );

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

   if (!response.ok) {
  const errorText = await response.text();

  console.error(
    "Pexels API error:",
    response.status,
    errorText
  );

  return res.status(502).json({
    message: "Pexels image request failed",
    status: response.status,
  });
}

    const data = await response.json();
    const photo = data.photos?.[0];

    if (!photo) {
      return res.status(404).json({
        message: "No destination image found",
      });
    }

    res.json({
      imageUrl: photo.src.large,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      photoUrl: photo.url,
    });
  } catch (error) {
    console.error("Destination image error:", error.message);

    res.status(500).json({
      message: "Unable to retrieve destination image",
    });
  }
});

module.exports = router;