#!/usr/bin/env node
/**
 * Download the Unsplash images used for Fruits, Vegetables, Animals
 * and save them locally so the app works offline.
 */
import fs from "fs";
import path from "path";
import https from "https";

const BASE_DIR = path.resolve("public/images");

const items = [
  // Fruits
  { dir: "fruits", file: "apple.jpg", url: "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "banana.jpg", url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "orange.jpg", url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "strawberry.jpg", url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "grapes.jpg", url: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "watermelon.jpg", url: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "pineapple.jpg", url: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "mango.jpg", url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "blueberry.jpg", url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&h=600&fit=crop" },
  { dir: "fruits", file: "cherry.jpg", url: "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=600&h=600&fit=crop" },
  // Vegetables (ones that were on Unsplash)
  { dir: "vegetables", file: "carrot.jpg", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&h=600&fit=crop" },
  { dir: "vegetables", file: "corn.jpg", url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=600&fit=crop" },
  { dir: "vegetables", file: "pepper.jpg", url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&h=600&fit=crop" },
  { dir: "vegetables", file: "onion.jpg", url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=600&fit=crop" },
  { dir: "vegetables", file: "cucumber.jpg", url: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=600&fit=crop" },
  { dir: "vegetables", file: "lettuce.jpg", url: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&h=600&fit=crop" },
  // Animals
  { dir: "animals", file: "dog.jpg", url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop" },
  { dir: "animals", file: "cat.jpg", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop" },
  { dir: "animals", file: "elephant.jpg", url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&h=600&fit=crop" },
  { dir: "animals", file: "lion.jpg", url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&h=600&fit=crop" },
  { dir: "animals", file: "rabbit.jpg", url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=600&fit=crop" },
  { dir: "animals", file: "fish.jpg", url: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&h=600&fit=crop" },
  { dir: "animals", file: "horse.jpg", url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=600&fit=crop" },
  { dir: "animals", file: "panda.jpg", url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=600&fit=crop" },
  { dir: "animals", file: "giraffe.jpg", url: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&h=600&fit=crop" },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const doGet = (u) => {
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          doGet(res.headers.location);
        } else if (res.statusCode === 200) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on("finish", () => { file.close(); resolve(); });
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
      }).on("error", reject);
    };
    doGet(url);
  });
}

async function main() {
  console.log(`\n📸 Downloading ${items.length} Unsplash images locally...\n`);
  for (const item of items) {
    const dir = path.join(BASE_DIR, item.dir);
    const dest = path.join(dir, item.file);
    fs.mkdirSync(dir, { recursive: true });
    try {
      await downloadFile(item.url, dest);
      console.log(`✅ ${item.dir}/${item.file}`);
    } catch (err) {
      console.error(`❌ ${item.dir}/${item.file}: ${err.message}`);
    }
  }
  console.log("\n✅ Done!\n");
}

main();
