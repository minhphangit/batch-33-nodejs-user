var express = require("express");
var router = express.Router();

const {
  getAll,
  create,
  getDetail,
  search,
  update,
  deleteFunc,
} = require("./controller");
const { validateSchema, checkIdSchema } = require("../../utils");
const { customerSchema, customerPatchSchema } = require("./validation");

router.route("/").get(getAll).post(validateSchema(customerSchema), create);

router.get("/search", search);

router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(customerSchema), update)
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(customerPatchSchema),
    update
  )
  .delete(validateSchema(checkIdSchema), deleteFunc);
module.exports = router;
