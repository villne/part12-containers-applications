const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  try {
    const id = req.params.id;

    const todo = await Todo.findOne({ id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;

    const todo = await Todo.findOne({ id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const result = await Todo.updateOne({ id }, task);
    res.status(200).send(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
