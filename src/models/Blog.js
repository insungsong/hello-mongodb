import mongoose from "mongoose";
import { CommentSchema } from "./Comment.js";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    //mongoose에게 UserSchema와 참조 되어있다는것을 ref를 통해 알려준다.
    //"user"라는 명칭은 UserSchema의 model생성때와 같아야한다.
    user: {
      _id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user"
      },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
      }
    },
    // 내장을 안하고 page nation 하기
    comments: [CommentSchema],
    // commentCount 세기
    commentCount: { type: Number, default: 0, required: true }
  },
  {
    timestamps: true //createdAt, updatedAt을 automazing 해주기위함
  }
);

//복합키
BlogSchema.index({ "user._id": 1, updatedAt: 1 });

//text index
//{'$text':{'$search':'commodi'}}와 같이 'commodi'라는 단어가 들어간것을 indexing을 돌려서 가져온다.
//{'$text':{'$search':'commodi accusamus'}} 이렇게 하면 두 단어가 나온다.
// BlogSchema.index({ title: "text" });
//복합 text
BlogSchema.index({ title: "text", content: "text" });

//unique한 경우에 사용
// BlogSchema.index({ 'user._id':1,updatedAt: 1,unique:true });

// 실제로 mongodb에 생성되는 키는 아니다. 말그대로 가상의 키
// virtual schema - 가상의 키 만들기
// BlogSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id", //blog pk
//   foreignField: "blog"
// });

// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

export const Blog = mongoose.model("blog", BlogSchema);

export default { Blog };
