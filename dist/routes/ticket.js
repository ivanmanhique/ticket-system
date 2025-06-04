"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_1 = __importDefault(require("../handlers/ticket"));
const ticket_router = (0, express_1.Router)();
ticket_router.post('/verify-ticket', ticket_1.default);
exports.default = ticket_router;
