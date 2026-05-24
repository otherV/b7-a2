"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express3 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_http_status_codes6 = require("http-status-codes");

// src/config/db.ts
var import_pg = __toESM(require("pg"));

// src/config/index.ts
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), ".env") });
var config = {
  port: Number(process.env.PORT),
  db: {
    connectionString: process.env.DATABASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "7d"
  }
};
var config_default = config;

// src/config/db.ts
var { Pool } = import_pg.default;
var pool = new Pool({
  connectionString: config_default.db.connectionString,
  max: 10,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 2e3
});
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client \u26A0\uFE0F:", err.message);
});
pool.connect().then(() => console.log("PostgreSQL connected \u2705")).catch((err) => console.error("PostgreSQL connection error \u274C:", err));
var db_default = pool;

// src/modules/auth/auth.routes.ts
var import_express = require("express");

// src/modules/auth/auth.controller.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_http_status_codes = require("http-status-codes");

// src/modules/auth/auth.queries.ts
var createUser = async (data, hashedPassword) => {
  const result = await db_default.query(
    `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at, updated_at`,
    [data.name, data.email, hashedPassword, data.role]
  );
  return result.rows[0];
};
var findUserByEmail = async (email) => {
  const result = await db_default.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// src/utility/sendResponse.ts
var sendResponse = ({
  res,
  statusCode,
  success,
  message,
  data,
  errors
}) => {
  const response = {
    success,
    message
  };
  if (data !== void 0) response.data = data;
  if (errors !== void 0) response.errors = errors;
  res.status(statusCode).json(response);
};

// src/modules/auth/auth.controller.ts
var register = async (req, res) => {
  try {
    const body = req.body;
    const existing = await findUserByEmail(body.email);
    if (existing) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes.StatusCodes.BAD_REQUEST,
        success: false,
        message: "Email already in use"
      });
    }
    const hashedPassword = await import_bcrypt.default.hash(body.password, 10);
    const user = await createUser(body, hashedPassword);
    sendResponse({
      res,
      statusCode: import_http_status_codes.StatusCodes.CREATED,
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};
var login = async (req, res) => {
  try {
    const body = req.body;
    const user = await findUserByEmail(body.email);
    if (!user) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes.StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Invalid email or password"
      });
    }
    const isMatch = await import_bcrypt.default.compare(body.password, user.password);
    if (!isMatch) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes.StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Invalid email or password"
      });
    }
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role
    };
    const token = import_jsonwebtoken.default.sign(payload, config_default.jwt.secret, {
      expiresIn: config_default.jwt.expiresIn
    });
    sendResponse({
      res,
      statusCode: import_http_status_codes.StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};

// src/modules/auth/auth.routes.ts
var router = (0, import_express.Router)();
router.post("/signup", register);
router.post("/login", login);
var auth_routes_default = router;

// src/modules/issues/issues.routes.ts
var import_express2 = require("express");

// src/modules/issues/issues.controller.ts
var import_http_status_codes2 = require("http-status-codes");

// src/modules/issues/issues.queries.ts
var createIssue = async (data, reporterId) => {
  const result = await db_default.query(
    `INSERT INTO issues (title, description, type, reporter_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
    [data.title, data.description, data.type, reporterId]
  );
  return result.rows[0];
};
var getAllIssues = async (filters) => {
  let query = `SELECT * FROM issues`;
  const values = [];
  const conditions = [];
  let paramIndex = 1;
  if (filters.type) {
    conditions.push(`type = $${paramIndex}`);
    values.push(filters.type);
    paramIndex++;
  }
  if (filters.status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(filters.status);
    paramIndex++;
  }
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }
  query += ` ORDER BY created_at ${filters.sort === "oldest" ? "ASC" : "DESC"}`;
  const result = await db_default.query(query, values);
  return result.rows;
};
var getIssueById = async (id) => {
  const result = await db_default.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};
var findUsersByIds = async (ids) => {
  const result = await db_default.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [ids]
  );
  return result.rows;
};
var updateIssue = async (id, data) => {
  const result = await db_default.query(
    `UPDATE issues
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             type = COALESCE($3, type),
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
    [data.title, data.description, data.type, id]
  );
  return result.rows[0];
};
var updateIssueStatus = async (id, status) => {
  const result = await db_default.query(
    `UPDATE issues
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};
var deleteIssue = async (id) => {
  await db_default.query(`DELETE FROM issues WHERE id = $1`, [id]);
};

// src/utility/parseId.ts
var parseId = (id) => {
  const parsed = parseInt(id);
  return isNaN(parsed) ? null : parsed;
};

// src/modules/issues/issues.controller.ts
var create = async (req, res) => {
  try {
    const body = req.body;
    const reporterId = req.user.id;
    const issue = await createIssue(body, reporterId);
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.CREATED,
      success: true,
      message: "Issue created successfully",
      data: issue
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};
var getAll = async (req, res) => {
  try {
    const filters = {};
    const { sort, type, status } = req.query;
    if (sort) filters.sort = sort;
    if (type) filters.type = type;
    if (status) filters.status = status;
    const issues = await getAllIssues(filters);
    const reporterIds = [...new Set(issues.map((i) => i["reporter_id"]))];
    const reporters = await findUsersByIds(reporterIds);
    const reporterMap = Object.fromEntries(reporters.map((r) => [r["id"], r]));
    const data = issues.map((issue) => ({
      ...issue,
      reporter: reporterMap[issue["reporter_id"]] ?? null
    }));
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.OK,
      success: true,
      message: "Issues retrieved successfully",
      data
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};
var getOne = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.BAD_REQUEST,
        success: false,
        message: "Invalid ID format provided",
        errors: "ID must be a valid number"
      });
    }
    const issue = await getIssueById(id);
    if (!issue) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found"
      });
    }
    const reporters = await findUsersByIds([issue["reporter_id"]]);
    const data = { ...issue, reporter: reporters[0] ?? null };
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.OK,
      success: true,
      message: "Issue retrieved successfully",
      data
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};
var update = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.BAD_REQUEST,
        success: false,
        message: "Invalid ID format provided",
        errors: "ID must be a valid number"
      });
    }
    const body = req.body;
    const { role, id: userId } = req.user;
    const issue = await getIssueById(id);
    if (!issue) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found"
      });
    }
    if (role === "contributor") {
      if (issue["reporter_id"] !== userId) {
        return sendResponse({
          res,
          statusCode: import_http_status_codes2.StatusCodes.FORBIDDEN,
          success: false,
          message: "You can only update your own issues"
        });
      }
      if (issue["status"] !== "open") {
        return sendResponse({
          res,
          statusCode: import_http_status_codes2.StatusCodes.CONFLICT,
          success: false,
          message: "You can only update open issues"
        });
      }
    }
    const updated = await updateIssue(id, body);
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
      data: updated
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};
var changeStatus = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.BAD_REQUEST,
        success: false,
        message: "Invalid ID format provided",
        errors: "ID must be a valid number"
      });
    }
    const { status } = req.body;
    const issue = await getIssueById(id);
    if (!issue) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found"
      });
    }
    const updated = await updateIssueStatus(id, status);
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.OK,
      success: true,
      message: "Issue status updated successfully",
      data: updated
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};
var remove = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.BAD_REQUEST,
        success: false,
        message: "Invalid ID format provided",
        errors: "ID must be a valid number"
      });
    }
    const issue = await getIssueById(id);
    if (!issue) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes2.StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found"
      });
    }
    await deleteIssue(id);
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.NO_CONTENT,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes2.StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong",
      errors: error
    });
  }
};

// src/middleware/authenticate.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_http_status_codes3 = require("http-status-codes");
var authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendResponse({
      res,
      statusCode: import_http_status_codes3.StatusCodes.UNAUTHORIZED,
      success: false,
      message: "No token provided"
    });
  }
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, config_default.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse({
      res,
      statusCode: import_http_status_codes3.StatusCodes.UNAUTHORIZED,
      success: false,
      message: "Invalid or expired token"
    });
  }
};
var authenticate_default = authenticate;

// src/middleware/authorize.ts
var import_http_status_codes4 = require("http-status-codes");
var authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse({
        res,
        statusCode: import_http_status_codes4.StatusCodes.FORBIDDEN,
        success: false,
        message: "You do not have permission to perform this action"
      });
    }
    next();
  };
};
var authorize_default = authorize;

// src/modules/issues/issues.routes.ts
var router2 = (0, import_express2.Router)();
router2.get("/", getAll);
router2.get("/:id", getOne);
router2.post("/", authenticate_default, create);
router2.patch("/:id", authenticate_default, update);
router2.patch("/:id/status", authenticate_default, authorize_default("maintainer"), changeStatus);
router2.delete("/:id", authenticate_default, authorize_default("maintainer"), remove);
var issues_routes_default = router2;

// src/middleware/errorHandler.ts
var import_http_status_codes5 = require("http-status-codes");
var errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  sendResponse({
    res,
    statusCode: import_http_status_codes5.StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    message: "Something went wrong",
    errors: err.message
  });
};
var errorHandler_default = errorHandler;

// src/app.ts
var app = (0, import_express3.default)();
app.use((0, import_cors.default)());
app.use(import_express3.default.json());
app.get("/", (req, res) => {
  res.json({ message: "DevPulse API is running \u{1F680}" });
});
app.use("/api/auth", auth_routes_default);
app.use("/api/issues", issues_routes_default);
app.use((req, res) => {
  sendResponse({
    res,
    statusCode: import_http_status_codes6.StatusCodes.NOT_FOUND,
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
app.use(errorHandler_default);
var app_default = app;

// src/server.ts
app_default.listen(config_default.port, () => {
  console.log(`Server running on port ${config_default.port}`);
});
