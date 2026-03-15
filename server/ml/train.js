const natural = require("natural");
const fs = require("fs");

const classifier = new natural.BayesClassifier();

const data = JSON.parse(fs.readFileSync("./ml/intents.json"));

data.forEach(item => {
 classifier.addDocument(item.text, item.intent);
});

classifier.train();

classifier.save("./ml/model.json", () => {
 console.log("Intent model trained successfully");
});