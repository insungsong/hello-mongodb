import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
    age: { type: Number, index: true },
    email: String
  },
  {
    //timestamps를 true로 하면 해당 row = document의 createdAt이 자동으로 생긴다. / updatedAt도 수정해준다.
    timestamps: true
  }
);

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

//"user"라는 Collection (table)을 만들것이고 그것의 schema는 UserSchema이다의 뜻
export const User = mongoose.model("user", UserSchema);

export default { User };
