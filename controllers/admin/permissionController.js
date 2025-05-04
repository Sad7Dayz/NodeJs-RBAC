const { validationResult } = require("express-validator");

const Permission = require("../../models/permissionModel");

const addPermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { permission_name } = req.body;
    const isExitsts = await Permission.findOne({
      name: {
        $regex: permission_name,
        $options: "i",
      },
    });

    if (isExitsts) {
      return res.status(400).json({
        success: false,
        msg: "Permission Name already exists",
      });
    }
    var obj = {
      permission_name,
    };
    if (req.body.default) {
      obj.is_default = parseInt(req.body.default);
    }

    const permission = new Permission(obj);
    const newPermission = await permission.save();
    return res.status(200).json({
      success: true,
      msg: "Permission added Successfully!",
      data: newPermission,
    });
  } catch (error) {
    return res.status(400).json({
      succeess: false,
      msg: error.message,
    });
  }
};

const getPermission = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    return res.status(200).json({
      suceess: true,
      msg: "Permission Fetched Successfully!",
      data: permissions,
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: error.message,
    });
  }
};

const deletePermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    await Permission.findByIdAndDelete({ _id: id });

    return res.status(400).json({
      suceess: true,
      msg: "Permission Deleted Successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: error.message,
    });
  }
};

const updatePermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { id, permission_name } = req.body;
    const isExitsts = await Permission.findOne({ _id: id });

    if (!isExitsts) {
      return res.status(400).json({
        success: false,
        msg: "Permission ID not found",
      });
    }

    const isNameAssigned = await Permission.findOne({
      _id: { $ne: id },
      permission_name: {
        $regex: permission_name,
        $options: "i",
      },
    });

    if (isNameAssigned) {
      return res.status(400).json({
        success: false,
        msg: "Permission name alrady assigned to another permission!",
      });
    }
    var updatePermission = {
      permission_name,
    };
    if (req.body.default != null) {
      updatePermission.is_default = parseInt(req.body.default);
    }

    const updatedPermission = await Permission.findByIdAndUpdate(
      { _id: id },
      {
        $set: updatePermission,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      msg: "Permission added Successfully!",
      data: updatedPermission,
    });
  } catch (error) {
    return res.status(400).json({
      suceess: false,
      msg: "Permission is not found!",
    });
  }
};
module.exports = {
  addPermission,
  getPermission,
  deletePermission,
  updatePermission,
};
