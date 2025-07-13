const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/cgi/search.pl`,
      {
        params: {
          search_terms: query,
          search_simple: 1,
          action: "process",
          json: 1,
        },
      }
    );

    const products = response.data.products.slice(0, 5).map((product) => ({
      name: product.product_name || "Unnamed Product",
      brand: product.brands || "Unknown",
      image:
        product.image_front_small_url ||
        "https://via.placeholder.com/100?text=No+Image",
      ecoScore: product.ecoscore_grade || "N/A",
      nutriScore: product.nutriscore_grade || "N/A",
    }));

    res.json(products);
  } catch (error) {
    console.error("Error fetching data from OpenFoodFacts:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
