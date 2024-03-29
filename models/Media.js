const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const mediaSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, require: true },
    location: { type: String, required: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

mediaSchema.virtual("customer", {
  ref: "customers",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

// Virtuals in console.log()
mediaSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
mediaSchema.set("toJSON", { virtuals: true });

const Media = model("Media", mediaSchema);
module.exports = Media;
