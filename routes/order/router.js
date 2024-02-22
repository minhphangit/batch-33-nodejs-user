var express = require("express");
var router = express.Router();

const {
  getAll,
  create,
  getDetail,
  updateStatus,
  updateShippingDate,
  updateEmployee,
} = require("./controller");
const { validateSchema, checkIdSchema } = require("../../utils");
const {
  orderSchema,
  updateStatusSchema,
  updateShippingDateSchema,
  updateEmployeeSchema,
} = require("./validation");

router.route("/").get(getAll).post(validateSchema(orderSchema), create);

router.route("/:id").get(validateSchema(checkIdSchema), getDetail);
router
  .route("/status/:id")
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateStatusSchema),
    updateStatus
  );
router
  .route("/shipped/:id")
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateShippingDateSchema),
    updateShippingDate
  );
router
  .route("/employee/:id")
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(updateEmployeeSchema),
    updateEmployee
  );

module.exports = router;
