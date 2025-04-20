const express = require("express");
const prisma = require("../db/prisma/client.prisma");

const articleRouter = express.Router();

// 게시글 등록
articleRouter.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const { title, content } = data;

    const article = await prisma.article.create({ data: { title, content } });

    res.status(201).json(article);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// 게시글 조회
articleRouter.get("/", async (req, res, next) => {
  try {
    const search = req.query.search;

    const article = await prisma.article.findMany({
      orderBy: { createAt: "desc" },
      skip: Number(req.query.offset) || undefined,
      where: search
        ? {
            OR: [
              { title: { contains: search } },
              { content: { contains: search } },
            ],
          }
        : undefined,
    });

    res.status(200).json(article);
  } catch (e) {
    next(e);
  }
});

// 게시글 하나 불러오기 + 댓글 가져오기
articleRouter.get("/:articleId", async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createAt: true,
        comments: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!article) throw new Error("일치한 게시글이 없습니다");

    res.status(201).json(article);
  } catch (e) {
    next(e);
  }
});

// 댓글 작성
articleRouter.post("/:articleId", async (req, res, next) => {
  try {
    const data = req.body;
    const articleId = req.params.articleId;

    const comment = await prisma.comments.create({
      data: { content: data.content, articleId },
    });

    res.status(201).json(comment);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = articleRouter;
