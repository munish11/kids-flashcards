#!/usr/bin/env node
/**
 * Download flashcard images from Pexels API and save locally.
 * 
 * Usage:
 *   PEXELS_API_KEY=your_key_here node scripts/download-images.mjs
 * 
 * Get a free API key at: https://www.pexels.com/api/
 */

import fs from "fs";
import path from "path";
import https from "https";

// Load .env file
const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.+)\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
}

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

if (!PEXELS_KEY) {
  console.error("❌ Set PEXELS_API_KEY in .env file.");
  console.error("   Get a free key at: https://www.pexels.com/api/");
  process.exit(1);
}

const items = [
  // Fruits
  { dir: "fruits", file: "apple.jpg", query: "red apple fruit close up" },
  { dir: "fruits", file: "banana.jpg", query: "yellow banana fruit" },
  { dir: "fruits", file: "orange.jpg", query: "orange fruit citrus" },
  { dir: "fruits", file: "strawberry.jpg", query: "strawberry fruit red" },
  { dir: "fruits", file: "grapes.jpg", query: "purple grapes bunch" },
  { dir: "fruits", file: "watermelon.jpg", query: "watermelon slice" },
  { dir: "fruits", file: "pineapple.jpg", query: "pineapple tropical fruit" },
  { dir: "fruits", file: "mango.jpg", query: "mango fruit" },
  { dir: "fruits", file: "blueberry.jpg", query: "blueberries bowl" },
  { dir: "fruits", file: "cherry.jpg", query: "red cherries" },
  // Fruits (alternate images)
  { dir: "fruits", file: "apple2.jpg", query: "green apple fruit" },
  { dir: "fruits", file: "banana2.jpg", query: "banana bunch tropical" },
  { dir: "fruits", file: "orange2.jpg", query: "sliced orange fruit" },
  { dir: "fruits", file: "strawberry2.jpg", query: "strawberry basket fresh" },
  { dir: "fruits", file: "grapes2.jpg", query: "green grapes vine" },
  { dir: "fruits", file: "watermelon2.jpg", query: "watermelon summer fruit" },
  // More fruits
  { dir: "fruits", file: "kiwi.jpg", query: "kiwi fruit sliced green" },
  { dir: "fruits", file: "peach.jpg", query: "fresh peach fruit" },
  { dir: "fruits", file: "pear.jpg", query: "green pear fruit" },
  { dir: "fruits", file: "coconut.jpg", query: "coconut tropical" },
  { dir: "fruits", file: "pomegranate.jpg", query: "pomegranate fruit seeds" },
  { dir: "fruits", file: "lemon.jpg", query: "yellow lemon citrus" },
  { dir: "fruits", file: "lime.jpg", query: "green lime citrus" },
  { dir: "fruits", file: "papaya.jpg", query: "papaya tropical fruit" },
  { dir: "fruits", file: "dragonfruit.jpg", query: "dragon fruit pink" },
  { dir: "fruits", file: "guava.jpg", query: "guava fruit fresh" },
  // More fruit alternates
  { dir: "fruits", file: "kiwi2.jpg", query: "kiwi fruit whole green", page: 2 },
  { dir: "fruits", file: "peach2.jpg", query: "peach tree ripe", page: 2 },
  { dir: "fruits", file: "pear2.jpg", query: "pear fruit yellow", page: 2 },
  { dir: "fruits", file: "coconut2.jpg", query: "coconut halved white", page: 2 },
  { dir: "fruits", file: "pomegranate2.jpg", query: "pomegranate open seeds red", page: 2 },
  { dir: "fruits", file: "lemon2.jpg", query: "lemon sliced half", page: 2 },
  { dir: "fruits", file: "lime2.jpg", query: "lime green sliced citrus", page: 2 },
  { dir: "fruits", file: "papaya2.jpg", query: "papaya sliced tropical", page: 2 },
  { dir: "fruits", file: "dragonfruit2.jpg", query: "dragon fruit sliced white", page: 2 },
  { dir: "fruits", file: "guava2.jpg", query: "guava sliced pink", page: 2 },
  { dir: "fruits", file: "pineapple2.jpg", query: "pineapple sliced tropical", page: 2 },
  { dir: "fruits", file: "mango2.jpg", query: "mango sliced ripe yellow", page: 2 },
  { dir: "fruits", file: "blueberry2.jpg", query: "blueberries fresh close up", page: 2 },
  { dir: "fruits", file: "cherry2.jpg", query: "cherries bowl fresh red", page: 2 },
  // Vegetables
  { dir: "vegetables", file: "carrot.jpg", query: "orange carrots" },
  { dir: "vegetables", file: "broccoli.jpg", query: "single broccoli floret green close up" },
  { dir: "vegetables", file: "tomato.jpg", query: "red tomato" },
  { dir: "vegetables", file: "corn.jpg", query: "corn cob yellow" },
  { dir: "vegetables", file: "peas.jpg", query: "green peas in pod" },
  { dir: "vegetables", file: "pepper.jpg", query: "bell pepper colorful" },
  { dir: "vegetables", file: "potato.jpg", query: "potatoes", source: "pixabay", pixabayType: "photo" },
  { dir: "vegetables", file: "onion.jpg", query: "onion vegetable" },
  { dir: "vegetables", file: "cucumber.jpg", query: "cucumber green" },
  { dir: "vegetables", file: "lettuce.jpg", query: "lettuce green salad" },
  // More vegetables
  { dir: "vegetables", file: "spinach.jpg", query: "fresh spinach leaves" },
  { dir: "vegetables", file: "cauliflower.jpg", query: "cauliflower white vegetable" },
  { dir: "vegetables", file: "eggplant.jpg", query: "eggplant purple vegetable" },
  { dir: "vegetables", file: "mushroom.jpg", query: "white mushroom fresh" },
  { dir: "vegetables", file: "garlic.jpg", query: "garlic bulb cloves" },
  { dir: "vegetables", file: "ginger.jpg", query: "fresh ginger root" },
  { dir: "vegetables", file: "pumpkin.jpg", query: "orange pumpkin" },
  { dir: "vegetables", file: "beetroot.jpg", query: "beetroot fresh red" },
  { dir: "vegetables", file: "radish.jpg", query: "red radish fresh" },
  { dir: "vegetables", file: "cabbage.jpg", query: "whole green cabbage head", page: 3 },
  // Vegetable alternates
  { dir: "vegetables", file: "carrot2.jpg", query: "carrots bunch fresh harvest", page: 2 },
  { dir: "vegetables", file: "broccoli2.jpg", query: "broccoli florets close up", page: 2 },
  { dir: "vegetables", file: "tomato2.jpg", query: "tomatoes vine ripe red", page: 2 },
  { dir: "vegetables", file: "corn2.jpg", query: "corn on cob fresh", page: 2 },
  { dir: "vegetables", file: "peas2.jpg", query: "green peas bowl fresh", page: 2 },
  { dir: "vegetables", file: "pepper2.jpg", query: "red bell pepper fresh", page: 2 },
  { dir: "vegetables", file: "potato2.jpg", query: "potatoes fresh whole", source: "pixabay", pixabayType: "photo" },
  { dir: "vegetables", file: "onion2.jpg", query: "red onion sliced", page: 2 },
  { dir: "vegetables", file: "cucumber2.jpg", query: "cucumber sliced fresh", page: 2 },
  { dir: "vegetables", file: "lettuce2.jpg", query: "lettuce head fresh green", page: 2 },
  { dir: "vegetables", file: "spinach2.jpg", query: "spinach leaves bowl", page: 2 },
  { dir: "vegetables", file: "cauliflower2.jpg", query: "cauliflower head white", page: 2 },
  { dir: "vegetables", file: "eggplant2.jpg", query: "eggplant aubergine purple", page: 2 },
  { dir: "vegetables", file: "mushroom2.jpg", query: "mushrooms fresh white", page: 2 },
  { dir: "vegetables", file: "pumpkin2.jpg", query: "pumpkin autumn orange", page: 2 },
  // Animals
  { dir: "animals", file: "dog.jpg", query: "cute dog puppy" },
  { dir: "animals", file: "cat.jpg", query: "cute cat" },
  { dir: "animals", file: "elephant.jpg", query: "elephant wildlife" },
  { dir: "animals", file: "lion.jpg", query: "lion wildlife" },
  { dir: "animals", file: "rabbit.jpg", query: "cute rabbit bunny" },
  { dir: "animals", file: "fish.jpg", query: "colorful tropical fish" },
  { dir: "animals", file: "horse.jpg", query: "horse running" },
  { dir: "animals", file: "panda.jpg", query: "panda bear" },
  { dir: "animals", file: "giraffe.jpg", query: "giraffe wildlife" },
  { dir: "animals", file: "bear.jpg", query: "brown grizzly bear" },
  // Animals (alternate images)
  { dir: "animals", file: "cat2.jpg", query: "kitten playing cute" },
  { dir: "animals", file: "dog2.jpg", query: "golden retriever dog" },
  { dir: "animals", file: "elephant2.jpg", query: "african elephant wildlife safari" },
  { dir: "animals", file: "lion2.jpg", query: "lion cub cute" },
  { dir: "animals", file: "rabbit2.jpg", query: "white rabbit fluffy" },
  { dir: "animals", file: "fish2.jpg", query: "goldfish aquarium" },
  // Colors
  { dir: "colors", file: "red.jpg", query: "red color background" },
  { dir: "colors", file: "blue.jpg", query: "blue color background" },
  { dir: "colors", file: "yellow.jpg", query: "yellow color background" },
  { dir: "colors", file: "green.jpg", query: "green color background" },
  { dir: "colors", file: "purple.jpg", query: "purple color background" },
  { dir: "colors", file: "orange-color.jpg", query: "orange color background" },
  { dir: "colors", file: "pink.jpg", query: "pink color background" },
  { dir: "colors", file: "white.jpg", query: "white color background" },
  { dir: "colors", file: "black.jpg", query: "black color background" },
  { dir: "colors", file: "brown.jpg", query: "brown color background" },
  // Shapes
  { dir: "shapes", file: "circle.jpg", query: "circle shape" },
  { dir: "shapes", file: "square.jpg", query: "square shape" },
  { dir: "shapes", file: "triangle.jpg", query: "triangle shape" },
  { dir: "shapes", file: "star.jpg", query: "star shape" },
  { dir: "shapes", file: "heart.jpg", query: "heart shape red" },
  { dir: "shapes", file: "diamond.jpg", query: "diamond shape" },
  { dir: "shapes", file: "oval.jpg", query: "oval shape" },
  { dir: "shapes", file: "rectangle.jpg", query: "rectangle shape" },
  { dir: "shapes", file: "pentagon.jpg", query: "pentagon shape" },
  { dir: "shapes", file: "hexagon.jpg", query: "hexagon shape" },
  // Shapes (real photo alternates)
  { dir: "shapes", file: "circle2.jpg", query: "circle shaped object round" },
  { dir: "shapes", file: "square2.jpg", query: "square shaped object block" },
  { dir: "shapes", file: "triangle2.jpg", query: "triangle shaped object" },
  { dir: "shapes", file: "star2.jpg", query: "star shaped cookie cutter" },
  { dir: "shapes", file: "heart2.jpg", query: "heart shaped red object" },
  { dir: "shapes", file: "diamond2.jpg", query: "diamond shape crystal" },
  { dir: "shapes", file: "oval2.jpg", query: "oval shaped egg" },
  { dir: "shapes", file: "rectangle2.jpg", query: "rectangle shaped brick block" },
  { dir: "shapes", file: "pentagon2.jpg", query: "pentagon building aerial" },
  { dir: "shapes", file: "hexagon2.jpg", query: "hexagon honeycomb pattern" },
  // Vehicles
  { dir: "vehicles", file: "car.jpg", query: "car automobile" },
  { dir: "vehicles", file: "bus.jpg", query: "yellow school bus" },
  { dir: "vehicles", file: "truck.jpg", query: "truck vehicle" },
  { dir: "vehicles", file: "airplane.jpg", query: "airplane flying sky" },
  { dir: "vehicles", file: "train.jpg", query: "train railway" },
  { dir: "vehicles", file: "boat.jpg", query: "sailboat ocean" },
  { dir: "vehicles", file: "bicycle.jpg", query: "bicycle bike" },
  { dir: "vehicles", file: "motorcycle.jpg", query: "motorcycle" },
  { dir: "vehicles", file: "helicopter.jpg", query: "helicopter flying" },
  { dir: "vehicles", file: "rocket.jpg", query: "rocket launch fire space shuttle" },
  // More vehicles
  { dir: "vehicles", file: "scooter.jpg", query: "motor scooter vespa" },
  { dir: "vehicles", file: "tractor.jpg", query: "farm tractor green field" },
  { dir: "vehicles", file: "ambulance.jpg", query: "ambulance emergency vehicle" },
  { dir: "vehicles", file: "firetruck.jpg", query: "red fire engine truck" },
  { dir: "vehicles", file: "submarine.jpg", query: "submarine underwater" },
  { dir: "vehicles", file: "hotairballoon.jpg", query: "colorful hot air balloon sky" },
  { dir: "vehicles", file: "skateboard.jpg", query: "skateboard colorful" },
  { dir: "vehicles", file: "jetski.jpg", query: "jet ski water sport" },
  { dir: "vehicles", file: "bulldozer.jpg", query: "yellow bulldozer construction" },
  { dir: "vehicles", file: "rickshaw.jpg", query: "auto rickshaw tuk tuk" },
  // Body Parts (Pixabay photos)
  { dir: "bodyparts", file: "hand.jpg", query: "child hand open palm", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "eye.jpg", query: "human eye close up blue", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "ear.jpg", query: "human ear close up", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "nose.jpg", query: "child nose face close up", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "mouth.jpg", query: "child smile mouth teeth", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "foot.jpg", query: "baby feet toes", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "finger.jpg", query: "child finger pointing hand", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "knee.jpg", query: "child knee leg", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "elbow.jpg", query: "arm elbow bend", source: "pixabay", pixabayType: "photo" },
  { dir: "bodyparts", file: "shoulder.jpg", query: "child shoulder arm", source: "pixabay", pixabayType: "photo" },
  // Numbers
  { dir: "numbers", file: "one.jpg", query: "number 1 colorful" },
  { dir: "numbers", file: "two.jpg", query: "number 2 colorful" },
  { dir: "numbers", file: "three.jpg", query: "number 3 colorful" },
  { dir: "numbers", file: "four.jpg", query: "number 4 colorful" },
  { dir: "numbers", file: "five.jpg", query: "number 5 colorful" },
  { dir: "numbers", file: "six.jpg", query: "number 6 colorful" },
  { dir: "numbers", file: "seven.jpg", query: "number 7 colorful" },
  { dir: "numbers", file: "eight.jpg", query: "number 8 colorful" },
  { dir: "numbers", file: "nine.jpg", query: "number 9 colorful" },
  { dir: "numbers", file: "ten.jpg", query: "number 10 colorful" },
  // Letters
  { dir: "letters", file: "a.jpg", query: "letter A colorful" },
  { dir: "letters", file: "b.jpg", query: "letter B colorful" },
  { dir: "letters", file: "c.jpg", query: "letter C colorful" },
  { dir: "letters", file: "d.jpg", query: "letter D colorful" },
  { dir: "letters", file: "e.jpg", query: "letter E colorful" },
  { dir: "letters", file: "f.jpg", query: "letter F colorful" },
  { dir: "letters", file: "g.jpg", query: "letter G colorful" },
  { dir: "letters", file: "h.jpg", query: "letter H colorful" },
  { dir: "letters", file: "i.jpg", query: "letter I colorful" },
  { dir: "letters", file: "j.jpg", query: "letter J colorful" },
  // Insects
  { dir: "insects", file: "butterfly.jpg", query: "butterfly colorful wings" },
  { dir: "insects", file: "ladybug.jpg", query: "ladybug insect red" },
  { dir: "insects", file: "bee.jpg", query: "bee insect flower" },
  { dir: "insects", file: "ant.jpg", query: "ant insect close up" },
  { dir: "insects", file: "dragonfly.jpg", query: "dragonfly insect" },
  { dir: "insects", file: "caterpillar.jpg", query: "caterpillar green" },
  { dir: "insects", file: "grasshopper.jpg", query: "grasshopper insect" },
  { dir: "insects", file: "beetle.jpg", query: "beetle insect" },
  { dir: "insects", file: "firefly.jpg", query: "firefly glowing night" },
  { dir: "insects", file: "moth.jpg", query: "moth insect wings" },
  // Ocean Life
  { dir: "oceanlife", file: "dolphin.jpg", query: "dolphin ocean jumping" },
  { dir: "oceanlife", file: "whale.jpg", query: "whale ocean" },
  { dir: "oceanlife", file: "seaturtle.jpg", query: "sea turtle underwater" },
  { dir: "oceanlife", file: "starfish.jpg", query: "starfish beach" },
  { dir: "oceanlife", file: "octopus.jpg", query: "octopus colorful underwater close up", source: "pixabay", pixabayType: "photo" },
  { dir: "oceanlife", file: "seahorse.jpg", query: "seahorse ocean underwater real", source: "pixabay", pixabayType: "photo" },
  { dir: "oceanlife", file: "jellyfish.jpg", query: "jellyfish glowing" },
  { dir: "oceanlife", file: "shark.jpg", query: "shark underwater" },
  { dir: "oceanlife", file: "clownfish.jpg", query: "clownfish anemone" },
  { dir: "oceanlife", file: "crab.jpg", query: "crab beach" },
  // Birds
  { dir: "birds", file: "parrot.jpg", query: "colorful parrot bird" },
  { dir: "birds", file: "penguin.jpg", query: "penguin bird" },
  { dir: "birds", file: "owl.jpg", query: "owl bird" },
  { dir: "birds", file: "eagle.jpg", query: "eagle bird flying" },
  { dir: "birds", file: "flamingo.jpg", query: "pink flamingo bird" },
  { dir: "birds", file: "peacock.jpg", query: "peacock feathers bird" },
  { dir: "birds", file: "hummingbird.jpg", query: "hummingbird flower" },
  { dir: "birds", file: "toucan.jpg", query: "toucan bird colorful" },
  { dir: "birds", file: "robin.jpg", query: "robin bird" },
  { dir: "birds", file: "swan.jpg", query: "white swan lake" },
  // Food
  { dir: "food", file: "pizza.jpg", query: "pizza food" },
  { dir: "food", file: "icecream.jpg", query: "ice cream cone" },
  { dir: "food", file: "cake.jpg", query: "birthday cake" },
  { dir: "food", file: "bread.jpg", query: "fresh bread loaf" },
  { dir: "food", file: "cheese.jpg", query: "cheese block" },
  { dir: "food", file: "cookies.jpg", query: "chocolate chip cookies" },
  { dir: "food", file: "pancakes.jpg", query: "pancakes breakfast" },
  { dir: "food", file: "donut.jpg", query: "donut sprinkles" },
  { dir: "food", file: "pasta.jpg", query: "pasta spaghetti" },
  { dir: "food", file: "sandwich.jpg", query: "sandwich food" },
  // Weather
  { dir: "weather", file: "sun.jpg", query: "bright sun sky" },
  { dir: "weather", file: "rain.jpg", query: "rain drops" },
  { dir: "weather", file: "snow.jpg", query: "snow winter" },
  { dir: "weather", file: "cloud.jpg", query: "white clouds blue sky" },
  { dir: "weather", file: "rainbow.jpg", query: "rainbow sky" },
  { dir: "weather", file: "lightning.jpg", query: "lightning storm" },
  { dir: "weather", file: "wind.jpg", query: "wind blowing trees" },
  { dir: "weather", file: "fog.jpg", query: "fog misty morning" },
  { dir: "weather", file: "tornado.jpg", query: "tornado storm" },
  { dir: "weather", file: "sunset.jpg", query: "sunset colorful sky" },
  // Musical Instruments
  { dir: "instruments", file: "guitar.jpg", query: "acoustic guitar" },
  { dir: "instruments", file: "piano.jpg", query: "piano keys" },
  { dir: "instruments", file: "drums.jpg", query: "drum set" },
  { dir: "instruments", file: "violin.jpg", query: "violin instrument" },
  { dir: "instruments", file: "trumpet.jpg", query: "trumpet brass" },
  { dir: "instruments", file: "flute.jpg", query: "flute instrument" },
  { dir: "instruments", file: "saxophone.jpg", query: "saxophone jazz" },
  { dir: "instruments", file: "harp.jpg", query: "harp instrument" },
  { dir: "instruments", file: "ukulele.jpg", query: "ukulele instrument" },
  { dir: "instruments", file: "xylophone.jpg", query: "xylophone colorful" },
  // Dinosaurs (use Pixabay for better illustrations)
  { dir: "dinosaurs", file: "trex.jpg", query: "t-rex cartoon kids", source: "pixabay" },
  { dir: "dinosaurs", file: "triceratops.jpg", query: "triceratops dinosaur", source: "pixabay" },
  { dir: "dinosaurs", file: "stegosaurus.jpg", query: "stegosaurus dinosaur", source: "pixabay" },
  { dir: "dinosaurs", file: "brachiosaurus.jpg", query: "brachiosaurus dinosaur", source: "pixabay" },
  { dir: "dinosaurs", file: "velociraptor.jpg", query: "velociraptor dinosaur", source: "pixabay" },
  { dir: "dinosaurs", file: "pterodactyl.jpg", query: "pterodactyl flying", source: "pixabay" },
  { dir: "dinosaurs", file: "spinosaurus.jpg", query: "spinosaurus dinosaur", source: "pixabay" },
  { dir: "dinosaurs", file: "ankylosaurus.jpg", query: "ankylosaurus dinosaur", source: "pixabay" },
  { dir: "dinosaurs", file: "parasaurolophus.jpg", query: "parasaurolophus dinosaur", source: "pixabay" },
  { dir: "dinosaurs", file: "diplodocus.jpg", query: "diplodocus dinosaur", source: "pixabay" },
  // Space
  { dir: "space", file: "moon.jpg", query: "full moon night sky" },
  { dir: "space", file: "stars.jpg", query: "starry night sky" },
  { dir: "space", file: "sun.jpg", query: "sun star space" },
  { dir: "space", file: "earth.jpg", query: "planet earth from space" },
  { dir: "space", file: "mars.jpg", query: "planet mars red" },
  { dir: "space", file: "saturn.jpg", query: "planet saturn rings" },
  { dir: "space", file: "astronaut.jpg", query: "astronaut space suit" },
  { dir: "space", file: "rocket.jpg", query: "rocket launch space" },
  { dir: "space", file: "galaxy.jpg", query: "galaxy milky way" },
  { dir: "space", file: "jupiter.jpg", query: "planet jupiter" },
  // Sports
  { dir: "sports", file: "soccer.jpg", query: "soccer ball field" },
  { dir: "sports", file: "basketball.jpg", query: "basketball hoop" },
  { dir: "sports", file: "baseball.jpg", query: "baseball bat ball" },
  { dir: "sports", file: "tennis.jpg", query: "tennis racket ball" },
  { dir: "sports", file: "swimming.jpg", query: "swimming pool" },
  { dir: "sports", file: "cricket.jpg", query: "cricket bat ball sport" },
  { dir: "sports", file: "cycling.jpg", query: "cycling bicycle sport" },
  { dir: "sports", file: "gymnastics.jpg", query: "gymnastics sport" },
  { dir: "sports", file: "skating.jpg", query: "ice skating sport" },
  { dir: "sports", file: "running.jpg", query: "running track sport" },
  // Cars
  { dir: "cars", file: "sedan.jpg", query: "sedan car" },
  { dir: "cars", file: "suv.jpg", query: "SUV car" },
  { dir: "cars", file: "sportscar.jpg", query: "red sports car" },
  { dir: "cars", file: "pickup.jpg", query: "pickup truck" },
  { dir: "cars", file: "convertible.jpg", query: "convertible car" },
  { dir: "cars", file: "jeep.jpg", query: "jeep off road" },
  { dir: "cars", file: "taxi.jpg", query: "yellow taxi cab" },
  { dir: "cars", file: "policecar.jpg", query: "police car" },
  { dir: "cars", file: "firetruck.jpg", query: "red fire truck" },
  { dir: "cars", file: "ambulance.jpg", query: "ambulance emergency" },
  // Household Items
  { dir: "household", file: "chair.jpg", query: "wooden chair furniture" },
  { dir: "household", file: "table.jpg", query: "dining table furniture" },
  { dir: "household", file: "lamp.jpg", query: "table lamp light" },
  { dir: "household", file: "clock.jpg", query: "wall clock" },
  { dir: "household", file: "bed.jpg", query: "bed bedroom" },
  { dir: "household", file: "door.jpg", query: "wooden door" },
  { dir: "household", file: "window.jpg", query: "window sunlight" },
  { dir: "household", file: "sofa.jpg", query: "sofa couch living room" },
  { dir: "household", file: "mirror.jpg", query: "mirror reflection" },
  { dir: "household", file: "bookshelf.jpg", query: "bookshelf books" },
  // Emotions
  { dir: "emotions", file: "happy.jpg", query: "happy child smiling" },
  { dir: "emotions", file: "sad.jpg", query: "sad child crying" },
  { dir: "emotions", file: "angry.jpg", query: "angry child face" },
  { dir: "emotions", file: "surprised.jpg", query: "surprised child face" },
  { dir: "emotions", file: "scared.jpg", query: "scared child hiding" },
  { dir: "emotions", file: "excited.jpg", query: "excited child jumping" },
  { dir: "emotions", file: "sleepy.jpg", query: "sleepy child yawning" },
  { dir: "emotions", file: "silly.jpg", query: "silly child funny face" },
  { dir: "emotions", file: "proud.jpg", query: "proud child achievement" },
  { dir: "emotions", file: "shy.jpg", query: "shy child hiding face" },
  // Toys (use Pixabay for better results)
  { dir: "toys", file: "teddybear.jpg", query: "teddy bear cute plush", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "ball.jpg", query: "colorful rubber ball child toy", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "blocks.jpg", query: "colorful wooden building blocks children", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "doll.jpg", query: "rag doll toy child", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "kite.jpg", query: "colorful kite flying blue sky", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "puzzle.jpg", query: "colorful jigsaw puzzle pieces children", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "toytrain.jpg", query: "wooden toy train colorful", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "robot.jpg", query: "toy robot colorful child", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "lego.jpg", query: "lego bricks colorful pile", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "crayons.jpg", query: "crayons colorful box children", source: "pixabay", pixabayType: "photo" },
  // More toys
  { dir: "toys", file: "bubbles.jpg", query: "soap bubbles child blowing", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "playdough.jpg", query: "play dough colorful children", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "yoyo.jpg", query: "yoyo toy colorful", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "drum.jpg", query: "toy drum child colorful", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "balloon.jpg", query: "colorful balloons party", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "toptoy.jpg", query: "spinning top toy colorful", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "racecar.jpg", query: "toy race car red child", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "xylophone-toy.jpg", query: "toy xylophone colorful child", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "sandbox.jpg", query: "sandbox toys bucket shovel", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "bicycle-toy.jpg", query: "child bicycle tricycle colorful", source: "pixabay", pixabayType: "photo" },
  // Even more toys
  { dir: "toys", file: "slide.jpg", query: "playground slide colorful children", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "swing.jpg", query: "child swing playground", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "trampoline.jpg", query: "trampoline child jumping", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "dollhouse.jpg", query: "dollhouse miniature toy", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "stuffeddog.jpg", query: "stuffed animal dog plush toy", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "marbles.jpg", query: "colorful glass marbles", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "jumprope.jpg", query: "jump rope colorful child", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "watergun.jpg", query: "water gun toy colorful summer", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "frisbee.jpg", query: "frisbee flying disc colorful", source: "pixabay", pixabayType: "photo" },
  { dir: "toys", file: "rubberduck.jpg", query: "rubber duck yellow bath toy", source: "pixabay", pixabayType: "photo" },
];

const BASE_DIR = path.resolve("public/images");

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirect
        https.get(response.headers.location, (res2) => {
          res2.pipe(file);
          file.on("finish", () => { file.close(); resolve(); });
        }).on("error", reject);
      } else {
        response.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      }
    }).on("error", reject);
  });
}

async function searchPexels(query, page) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page}&orientation=square`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.photos?.[0]?.src?.large || null;
}

async function searchPixabay(query, imageType) {
  if (!PIXABAY_KEY) {
    console.error("❌ Set PIXABAY_API_KEY in .env for Pixabay images.");
    console.error("   Get a free key at: https://pixabay.com/api/docs/");
    return null;
  }
  const type = imageType || "illustration";
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=${type}&per_page=3&min_width=400&min_height=400`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.hits?.[0]?.webformatURL || null;
}

async function searchAndDownload(item) {
  const dir = path.join(BASE_DIR, item.dir);
  const dest = path.join(dir, item.file);

  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log(`⏭️  Skip (exists): ${item.dir}/${item.file}`);
    return;
  }

  fs.mkdirSync(dir, { recursive: true });

  try {
    let imageUrl;
    if (item.source === "pixabay") {
      imageUrl = await searchPixabay(item.query, item.pixabayType);
    } else {
      const page = item.page || 1;
      imageUrl = await searchPexels(item.query, page);
    }

    if (!imageUrl) {
      console.error(`❌ No results for "${item.query}" (${item.source || "pexels"})`);
      return;
    }

    await downloadFile(imageUrl, dest);
    console.log(`✅ Downloaded: ${item.dir}/${item.file}`);
  } catch (err) {
    console.error(`❌ Failed "${item.query}":`, err.message);
  }
}

async function main() {
  console.log(`\n📸 Downloading ${items.length} images from Pexels...\n`);

  // Process 5 at a time to avoid rate limits
  for (let i = 0; i < items.length; i += 5) {
    const batch = items.slice(i, i + 5);
    await Promise.all(batch.map(searchAndDownload));
  }

  console.log("\n✅ Done! Images saved to public/images/\n");
}

main();
