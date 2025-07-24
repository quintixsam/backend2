import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export default mongoose.model("PasswordResetToken", passwordResetTokenSchema);
