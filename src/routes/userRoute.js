import { Router } from "express";
import mongoose from "mongoose";
import { User, Blog, Comment } from "../models/index.js";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await User.find().limit(5);
  return res.send({ result: "SUCCESS", users });
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ result: "INVALID USER_ID" });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(500).send({ result: "NOT FOUND USER!", user: [] });
    }

    return res.status(200).send({ result: "SUCCESS", user });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
});

userRouter.post("/", async (req, res) => {
  try {
    let { username, name } = req.body;

    if (!username) {
      return res.status(400).send({ err: "not found username!" });
    }

    if (!name || !name.first || !name.last) {
      return res.status.status(400).send({ error: "not found name status!" });
    }

    const user = new User(req.body);
    await user.save();
    return res.send({ result: "SUCCESS", user });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
});

userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({ result: "INVALID USER_ID" });
    }

    //만약에 없다면, 뭐가? 유저 아이디가 존재하는 유저아이디가 아니라면
    // const user = await User.findOne({ _id: userId });

    // if (!user) {
    //   return res.status(400).send({ result: "NOT_FOUND_USER" });
    // }

    // await User.deleteOne({ _id: userId });

    const [user] = await Promise.all([
      await User.findOneAndDelete({ _id: userId }),
      await Blog.deleteMany({ "user._id": userId }),
      await Blog.updateMany(
        { "comments.user": userId },
        { $pull: { comments: { user: userId } } }
      ),
      await Comment.deleteMany({ user: userId })
    ]);

    if (!user) {
      return res.status(400).send({ result: "NOT_FOUND_USER" });
    }

    return res.send({ result: "SUCCESS" });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("userID: ", userId);

    const { age, name } = req.body;

    if (!age && !name) {
      res.status(400).send({ result: "age or name is required!" });
    }
    if (age && typeof age !== "number")
      return res.status(400).send({ result: "age must be number!" });

    if (
      (name && typeof name.first !== "string") ||
      (name && typeof name.last !== "string")
    )
      return res.status(400).send({ result: "first or last must be string!" });

    //mongodb에 한번에 connection 해서 사용하는 경우
    // let updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;
    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   // { $set: { age } },
    //   updateBody,
    //   { new: true }
    // );

    //db커넥션은 두번이지만 mongoose에서 지정한 required document를 검증 check할 수 있다.
    const user = await User.findById(userId);
    console.log("before changed User: ", user);
    if (age) user.age = age;
    if (name) user.name = name;

    //user 이름이 바뀌면 blog의 user의 이름도 바꿔줘야하고, commentUser들도 바꿔줘야한다.
    // const blogs = await Blog.find({ "user._id": userId });

    // for (const blog of blogs) {
    //   if (name) blog.user.username = `${name.first} ${name.last}`;

    //   await blog.save();
    // }

    await Blog.updateMany(
      {
        "user._id": userId
      },
      {
        "user.username": `${name.first} ${name.last}`
      }
    );

    //해당 블로그에 해당 유저 정보를 업데이트해줘야한다.
    await Blog.updateMany(
      {},
      //element = index가 아니라, $[element]자체가 객체이다. 이것을 가지고 arrayFilters를 해줘야한다.
      //arrayFilters: [{ "element.user._id": userId }] = comments배열 안에서 user_id가 userId인 것을 찾아서 업데이트 한다.
      {
        "comments.$[comment].userFullName": `${name.first} ${name.last}`
      },
      {
        arrayFilters: [{ "comment.user": userId }]
      }
    );

    // const comments = await Comment.find({ user: userId });

    // for (let comment of comments) {
    //   comment.userFullName = `${name.first} ${name.last}`;

    //   await comment.save();
    // }

    await Comment.updateMany(
      { user: userId },
      { userFullName: `${name.first} ${name.last}` }
    );

    if (!user) {
      res.status(400).send({ result: "NOT_FOUND_USER!" });
    }

    return res.send({ result: "SUCCESS", user });
  } catch (error) {
    return res.status(500).send({ result: error });
  }
});

export default { userRouter };
