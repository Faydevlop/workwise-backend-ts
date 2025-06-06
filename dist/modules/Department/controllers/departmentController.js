"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editDetails = exports.listDetails = exports.deleteDepartment = exports.showDepartments = exports.addDepartment = exports.listManager = exports.listNonDepartmentempo = void 0;
const departmentService = __importStar(require("../serviecs/departmentService"));
const listNonDepartmentempo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req is here 1');
    try {
        const users = yield departmentService.findNonDepartmentEmployees();
        console.log('req is here 2');
        console.log(users.length);
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching users with no department' });
    }
});
exports.listNonDepartmentempo = listNonDepartmentempo;
const listManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield departmentService.findManagers();
        res.status(200).json(admins);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something broke!' });
    }
});
exports.listManager = listManager;
const addDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedDepartment = yield departmentService.createDepartment(req.body);
        res.status(201).json(savedDepartment);
    }
    catch (error) {
        console.error('Error adding department:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addDepartment = addDepartment;
const showDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield departmentService.getAllDepartments();
        res.status(200).json(departments);
    }
    catch (error) {
        console.error('Error listing department:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.showDepartments = showDepartments;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departmentId } = req.params;
        const result = yield departmentService.removeDepartment(departmentId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteDepartment = deleteDepartment;
const listDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departmentId } = req.params;
        const details = yield departmentService.getDepartmentDetails(departmentId);
        res.status(200).json(details);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.listDetails = listDetails;
const editDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = req.params;
    try {
        const result = yield departmentService.updateDepartmentDetails(departmentId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.editDetails = editDetails;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('request are here');
    const { departmentId } = req.params;
    const { teamMemberIds } = req.body;
    console.log(teamMemberIds, departmentId);
    try {
        const result = yield departmentService.removeTeamMember(departmentId, teamMemberIds);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteUser = deleteUser;
