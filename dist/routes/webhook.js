"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const webhook_1 = __importDefault(require("../handlers/webhook"));
const webhook_route = (0, express_1.Router)();
webhook_route.post('/webhook', body_parser_1.default.raw({ type: 'application/json' }), webhook_1.default);
exports.default = webhook_route;
