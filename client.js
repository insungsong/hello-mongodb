import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// original 1
// const test = async () => {
//   let {
//     data: { blogs }
//   } = await axios.get(`http://localhost:3000/blog`);

//   blogs = await Promise.all(
//     blogs.map(async (blog) => {
//       const response1 = await axios.get(
//         `http://localhost:3000/user/${blog.user}`
//       );
//       const response2 = await axios.get(
//         `http://localhost:3000/blog/${blog._id}/comment`
//       );

//       blog.user = response1.data.user;
//       blog.comment = response2.data.comment;

//       return blog;
//     })
//   );

//   console.log(blogs[0]);
// };

// # refectoring
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, ".env") });

const URL = process.env.URL;

const test = async () => {
  console.time();
  let {
    data: { blogs }
  } = await axios.get(`${URL}/blog`);

  // console.log("blogs: ", blogs);

  //   blogs = await Promise.all(
  //     blogs.map(async (blog) => {
  //       const response1 = await axios.get(`${URL}/user/${blog.user}`);
  //       const response2 = await axios.get(`${URL}/blog/${blog._id}/comment`);

  //       blog.user = response1.data.user;
  //       blog.comment = response2.data.data;

  //       return blog;
  //     })
  //   );

  console.timeEnd();
};

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
};

testGroup();
