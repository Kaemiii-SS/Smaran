const animalNames = [
  "ant", "bat", "bear", "beaver", "bird", "butterfly", "camel", "capybara",
  "cat", "chick", "chicken", "cow", "crocodile", "deer", "dog", "dolphin",
  "duck", "elephant", "fox", "frog", "giraffe", "goat", "hedgehog", "hippo",
  "horse", "horse_b", "kangaroo", "koala", "ladybug", "llama", "monkey",
  "mouse", "octopus", "otter", "owl", "panda", "penguin", "pig", "porcupine",
  "rabbit", "raccoon", "red_panda", "rhino", "seal", "sheep", "skunk",
  "sloth", "snail", "snake", "tiger", "turtle", "woodchuck", "zebra"
];

export const ALL_ANIMALS = animalNames.map(name => ({
  url: `/animals/${name}.png`,
  title: name.toUpperCase(),
  maker: ""
}));

