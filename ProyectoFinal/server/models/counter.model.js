const { Schema, model } = require("mongoose");

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.static("increment", async function (counterName) {
  const count = await this.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return count.seq;
});

const CounterModel = model("Counter", counterSchema);

module.exports = { CounterModel };
