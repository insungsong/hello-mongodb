import mongoose from "mongoose";
import { Router } from "express";
import { Blog, User, Comment } from "../models/index.js";

//mergeParams는 Blog의 자식 router로 사용할 수 있기에 부모에 merge 되겠다는 뜻에서 사용한다.
export const commentRouter = Router({ mergeParams: true });
// export const commentRouter = Router();

commentRouter.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  console.log("session: ", session);

  let comment;
  try {
    await session.withTransaction(async () => {
      const { blogId } = req.params;

      const { content, userId } = req.body;

      if (!mongoose.isObjectIdOrHexString(blogId))
        return res.status(404).send({ error: "not found blog" });

      if (!mongoose.isObjectIdOrHexString(userId))
        return res.status(404).send({ error: "not found userId" });

      const [blog, user] = await Promise.all([
        Blog.findById(blogId, {}, { session }),
        User.findById(userId, {}, { session })
      ]);

      if (!blog.islive)
        return res.status(400).send({ error: "isInvalid not true blog" });

      if (!blog || !user)
        return res.status(404).send({ error: "not found blog or user" });

      comment = new Comment({
        content: content,
        user: user,
        userFullName: `${user.name.first} ${user.name.last}`,
        blog: blogId
      });

      console.log("comment: ", comment);

      // await Promise.all([
      //   comment.save(),
      //   Blog.updateOne(
      //     { _id: blog.id },
      //     {
      //       $push: { comments: comment }
      //     }
      //   )
      // ]);
      //

      blog.commentCount++;
      blog.comments.push(comment);

      if (blog.comments > 3) {
        blog.comments.shift();
      }

      await Promise.all(
        comment.save({ session }),
        blog.save()
        // count 1올리기
        // Blog.updateOne({ _id: blogId }, { $inc: { commentCount: 1 } })
      );
    });

    return res.status(200).send({
      data: comment
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  } finally {
    await session.endSession();
  }
});

commentRouter.get("/", async (req, res) => {
  let { page = 0 } = req.query;
  try {
    page = parseInt(page);

    const { blogId } = req.params;

    if (!mongoose.isObjectIdOrHexString(blogId))
      return res.status(404).send({ error: "is required isObjectTypeId" });

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).send({ error: "not found blog" });

    //생성순 기준으로
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .skip(page * 3)
      .limit(3);

    return res.status(200).send({ result: "SUCCESS", data: comments });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
});

commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;

  const { content } = req.body;

  if (typeof content !== "string")
    res.status(400).send({ error: "content is required!" });

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { content: content },
    { new: true }
  );

  //js문법이 아니라 이상하지만 이게 mongodb 문법임, Blog document중 comments key의 _id중 commentId를 찾는 문법이다.
  //{ "comments._id": commentId } : 해당 blog에서 해당 commentId가 있는 {}까지 find했고
  //위에서 타켓된것중 comments.$.content = comment[10].content와 같음 comments.$.content = content
  await Blog.updateOne(
    { "comments._id": commentId },
    { "comments.$.content": content },
    { new: true }
  );

  return res.status(200).send({ comment });
});

commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findOneAndDelete({ _id: commentId });

  //$pull = push는 배열안에 값을 넣는것이였다면,$pull은 배열안에서 해당 값을 뺴는 역할이다.
  await Blog.UpdateOne(
    { "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } }
    //{ $pull: { comments: { status:true, title:'hello'} } }//이렇게 하면 status가 true or title:'hello'인 둘중 하나라도 충족하면 update를 친다.
    // { $pull: { comments: { $elemMatch: { status: true, title: "hello" } } } }// status = true && title: "hello" 인것을 찾을 수 있다.
  );

  return res.status(200).send({ comment });
});

export default { commentRouter };
