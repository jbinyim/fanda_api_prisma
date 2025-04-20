const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const commentRouter = express.Router();

commentRouter.post("/", async (req, res, next) => {
  try {
    const { content, articleId } = req.body;

    const comment = await prisma.comments.create({
      data: { content, articleId },
    });

    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
});

module.exports = commentRouter;

// article에서 댓글을 만들어야 할듯 주소 때문에
