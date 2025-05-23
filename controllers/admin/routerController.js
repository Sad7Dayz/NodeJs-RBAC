const { validationResult } = require("express-validator");
const RouterPermission = require("../../models/routerPermissionModel");
const getAllRoutes = async (req, res) => {
  try {
    const routes = [];
    const stack = req.app._router.stack;
    stack.forEach((data) => {
      if (data.name === "router" && data.handle.stack) {
        data.handle.stack.forEach((handler) => {
          routes.push({
            path: handler.route.path,
            methods: handler.route.methods,
          });
        });
      }
      console.log(data.name);
      console.log(data);
    });
    return res.status(200).json({
      succeess: true,
      msg: "All Routes!",
      data: routes,
    });
  } catch (error) {
    return res.status(400).json({
      succeess: false,
      msg: error.message,
    });
  }
};

const addRouterPermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { router_endpoint, role, permission_id, permission } = req.body;
    const routerPermission = await RouterPermission.findOneAndUpdate(
      { router_endpoint, role },
      { router_endpoint, role, permission_id, permission },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      succees: true,
      msg: "Router Permission added/updated!",
      data: routerPermission,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getRouterPermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { router_endpoint } = req.body;
    const routerPermission = await RouterPermission.find({
      router_endpoint,
    }).populate("permission_id");

    return res.status(200).json({
      success: true,
      msg: "Router Permission added/updated!",
      data: routerPermission,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};
module.exports = {
  getAllRoutes,
  addRouterPermission,
  getRouterPermission,
};
