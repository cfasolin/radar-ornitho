const express = require('express');
const cors = require('cors');
const GeoTIFF = require('geotiff');

const app = express();
app.use(cors());

let image;
let raster;

async function loadRaster() {
  const tiff = await GeoTIFF.fromFile('worldcover.tif');
  image = await tiff.getImage();
  raster = await image.readRasters();
  console.log('Raster WorldCover chargé');
}

loadRaster();

function getPixelValue(x, y, width, height, rasterData) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return null;
  }
  return rasterData[y * width + x];
}

function getDistribution(values) {
  const counts = {};

  for (const value of values) {
    if (value == null) continue;
    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}

function getMajorityClass(distribution) {
  let maxCount = 0;
  let majorityClass = null;

  for (const key in distribution) {
    if (distribution[key] > maxCount) {
      maxCount = distribution[key];
      majorityClass = Number(key);
    }
  }

  return majorityClass;
}

function interpretHabitat(distribution) {
  const tree = distribution[10] || 0;     // arbres
  const grass = distribution[30] || 0;    // prairie / herbacé
  const urban = distribution[50] || 0;    // urbain
  const water = distribution[80] || 0;    // eau
  const wetland = distribution[90] || 0;  // humide
  const shrub = distribution[20] || 0;    // arbustes
  const crop = distribution[40] || 0;     // cultures

  const total = tree + grass + urban + water + wetland + shrub + crop;

  if (total === 0) return 'inconnu';

  const pTree = tree / total;
  const pGrass = grass / total;
  const pUrban = urban / total;
  const pWater = water / total;
  const pWetland = wetland / total;
  const pShrub = shrub / total;
  const pCrop = crop / total;

  if (pWater >= 0.4) return 'plan_eau';
  if (pWetland >= 0.3) return 'zone_humide';

  if (pUrban >= 0.5 && pTree >= 0.15) return 'urbain_vegetalise';
  if (pUrban >= 0.6) return 'urbain';

  if (pTree >= 0.6 && pUrban < 0.2) return 'foret';
  if (pGrass >= 0.5 && pTree >= 0.15) return 'prairie_arboree';
  if (pGrass >= 0.5) return 'prairie';

  if (pCrop >= 0.5) return 'cultures';
  if (pShrub >= 0.3) return 'fourres';

  if (pTree >= 0.3 && pUrban >= 0.2) return 'urbain_vegetalise';
  if (pTree >= 0.3 && pGrass >= 0.3) return 'prairie_arboree';

  return 'mosaique';
}

app.get('/worldcover', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (!image || !raster) {
    return res.json({ error: 'Raster non chargé' });
  }

  const width = image.getWidth();
  const height = image.getHeight();
  const bbox = image.getBoundingBox();

  const xCenter = Math.floor(
    ((lon - bbox[0]) / (bbox[2] - bbox[0])) * width
  );

  const yCenter = Math.floor(
    ((bbox[3] - lat) / (bbox[3] - bbox[1])) * height
  );

  const values = [];

  // Buffer 9x9 = 81 pixels
  for (let dx = -4; dx <= 4; dx++) {
    for (let dy = -4; dy <= 4; dy++) {
      const value = getPixelValue(
        xCenter + dx,
        yCenter + dy,
        width,
        height,
        raster[0]
      );
      values.push(value);
    }
  }

  const distribution = getDistribution(values);
  const majorityClass = getMajorityClass(distribution);
  const habitat = interpretHabitat(distribution);

  res.json({
    class: majorityClass,
    habitat,
    distribution,
    sampledValues: values,
  });
});

app.listen(3000, () => {
  console.log('Proxy raster WorldCover lancé');
});