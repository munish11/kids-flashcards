#!/usr/bin/env node
import fs from "fs";
import path from "path";
import https from "https";

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) { console.error("Set PEXELS_API_KEY"); process.exit(1); }

const items = [
  // Bad veggies
  { dir: "vegetables", file: "broccoli.jpg", query: "single broccoli floret green vegetable white background" },
  { dir: "vegetables", file: "peas.jpg", query: "green peas in open pod close up" },
  // Bad vehicles
  { dir: "vehicles", file: "car.jpg", query: "modern red car side view" },
  { dir: "vehicles", file: "airplane.jpg", query: "commercial airplane flying blue sky" },
  { dir: "vehicles", file: "train.jpg", query: "passenger train on railway tracks" },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const doGet = (u) => {
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doGet(res.headers.location);
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => { file.close(resolve); });
      }).on("error", reject);
    };
    doGet(url);
  });
}

for (const item of items) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(item.query)}&per_page=1&orientation=square`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  const data = await res.json();
  const imageUrl = data.photos?.[0]?.src?.large;
  if (!imageUrl) { console.error(`❌ No result: ${item.query}`); continue; }
  const dest = path.join("public/images", item.dir, item.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  await download(imageUrl, dest);
  console.log(`✅ ${item.dir}/${item.file}`);
}
