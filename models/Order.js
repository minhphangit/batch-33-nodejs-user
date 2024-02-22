const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    versionKey: false,
  }
);

productSchema.virtual("product", {
  foreignField: "_id",
  ref: "products",
  localField: "productId",
  justOne: true,
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const orderSchema = new Schema(
  {
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    shippedDate: {
      type: Date,
    },
    paymentType: {
      type: String,
      required: true,
      default: "CASH",
      enum: ["CASH", "CREDIT_CARD"],
    },
    status: {
      type: String,
      required: true,
      enum: ["WAITING", "COMPLETED", "CANCELED", "REJECTED", "DELIVERING"],
      default: "WAITING",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employees",
    },
    productList: [productSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.virtual("customer", {
  ref: "customers",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.virtual("employee", {
  ref: "employees",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});

orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });

const Order = model("orders", orderSchema);
module.exports = Order;
