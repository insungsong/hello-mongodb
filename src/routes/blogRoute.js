import { Router } from "express";
import mongoose from "mongoose";
import { Blog, User, Comment } from "../models/index.js";

export const blogRouter = Router();

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;

    if (!title || typeof title !== "string")
      res.status(400).send({ error: "not compare type or title not required" });

    if (!content || typeof content !== "string")
      res
        .status(400)
        .send({ error: "not compare type or content not required" });

    if (islive && typeof islive !== "boolean")
      res.status(400).send({ error: "not compare type" });

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).send({ error: "not found user" });
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(400).send({ error: "not found user" });
    }

    const blog = new Blog({
      ...req.body,
      user
    });

    await blog.save();

    return res.send({ blog });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
    // const blogs = await Blog.find({})
    //   .limit(50)
    //   .populate([
    //     { path: "user" },
    //     { path: "comments", populate: { path: "user" } }
    //   ]);

    let { page } = req.query;
    page = parseInt(page);

    const blogs = await Blog.find({})
      .sort({ updatedAt: -1 })
      .skip(page * 3)
      .limit(3);

    return res.send({ blogs });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.isObjectIdOrHexString(blogId))
      return res.status(400).send({ error: "not found user" });

    const blog = await Blog.findById(blogId);

    const commentCount = await Comment.find({
      blog: blogId
    }).countDocuments();

    return res.send({ blog, commentCount });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content } = req.body;

    if (!mongoose.isObjectIdOrHexString(blogId))
      return res.status(400).send({ error: "not found user" });

    if (title && typeof title !== "string")
      return res.status(400).send({ err: "not matched title type" });

    if (content && typeof content !== "string")
      return res.status(400).send({ err: "not matched content type" });

    const blog = await Blog.findById(blogId);

    if (!blog) {
      res.status(404).send({ error: "blog not found" });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;

    await blog.save();

    return res.status(200).send({ result: "SUCCESS", data: blog });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

blogRouter.patch("/:blogId/islive", async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!mongoose.isObjectIdOrHexString(blogId))
      return res.status(400).send({ error: "not found user" });

    const { islive } = req.body;

    if (islive == null)
      return res.status(404).send({ error: "not found islive" });

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).send({ error: "not found blog" });

    blog.islive = islive;

    await blog.save();

    return res.status(200).send({ result: "SUCCESS", data: blog });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

export default { blogRouter };
