"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ticket_1 = __importDefault(require("./routes/ticket"));
const webhook_1 = __importDefault(require("./routes/webhook"));
dotenv_1.default.config();
const createApp = () => {
    const app = (0, express_1.default)();
    app.use('/', webhook_1.default);
    app.use(express_1.default.json());
    app.use('/', ticket_1.default);
    return app;
};
exports.default = createApp;
