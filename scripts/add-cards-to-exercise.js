require("dotenv").config();

const inquirer = require("inquirer");

const createConnection = require("../lib/db/connection");
const { Exercise, Card } = require("../lib/db/models");

inquirer
  .prompt([
    {
      type: "input",
      name: "exerciseId",
      message: "Paste exercise id"
    },
    {
      type: "input",
      name: "cards",
      message: "Paste cards separated by comma"
    }
  ])
  .then(async answers => {
    await createConnection();

    await addCardsToExercise({
      exerciseId: answers.exerciseId,
      cards: JSON.parse(answers.cards)
    });
  });

async function addCardsToExercise({ exerciseId, cards }) {
  const exercise = await Exercise.findOne({ _id: exerciseId });
  console.log("Adding to exercise: ", exercise.title);

  for (let card of cards) {
    card = new Card({
      content: card.content,
      published: card.published,
      correct: card.correct
    });
    card = await card.save();
    exercise.cards.push(card._id);
  }

  await exercise.save();
  console.log("Finished!");
}
