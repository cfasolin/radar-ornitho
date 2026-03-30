const express = require('express');
const cors = require('cors');
const GeoTIFF = require('geotiff');

const app = express();
app.use(cors());

let image;
let raster;

// --- Charger raster au démarrage ---
async function loadRaster() {
  const tiff = await GeoTIFF.fromFile('worldcover.tif');
  image = await tiff.getImage();
  raster = await image.readRasters();
  console.log('Raster WorldCover chargé');
}

loadRaster();

// --- Endpoint ---
app.get('/worldcover', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (!image) {
    return res.json({ error: 'Raster non chargé' });
  }

  const width = image.getWidth();
  const height = image.getHeight();
  const bbox = image.getBoundingBox();

  const x = Math.floor(
    ((lon - bbox[0]) / (bbox[2] - bbox[0])) * width
  );

  const y = Math.floor(
    ((bbox[3] - lat) / (bbox[3] - bbox[1])) * height
  );

  const value = raster[0][y * width + x];

  res.json({
    class: value,
  });
});

app.listen(3000, () => {
  console.log('Proxy raster WorldCover lancé');
});
