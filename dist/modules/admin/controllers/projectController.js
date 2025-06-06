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
exports.listTasks = exports.projectlisting = exports.deleteProject = exports.editProject = exports.getprojectdetails = exports.listProjects = exports.addNewProject = void 0;
const projectService = __importStar(require("../serviecs/projectService"));
const addNewProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, status, startDate, endDate, priority, description, sdepartment, } = req.body;
    console.log(name, status, startDate, endDate, priority, description, sdepartment);
    try {
        const result = yield projectService.createProject(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error creating project:", error);
        if (error instanceof Error && error.message === 'Duplicate Project is Found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Error creating project" });
        }
    }
});
exports.addNewProject = addNewProject;
const listProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield projectService.getAllProjects();
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching projects" });
    }
});
exports.listProjects = listProjects;
const getprojectdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const projectDetails = yield projectService.getProjectById(projectId);
        res.status(200).json(projectDetails);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Error fetching project details" });
    }
});
exports.getprojectdetails = getprojectdetails;
const editProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        const result = yield projectService.updateProject(projectId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error updating project:", error);
        res.status(error instanceof Error && error.message === "Project not found" ? 400 : 500)
            .json({ message: error instanceof Error ? error.message : "Server error" });
    }
});
exports.editProject = editProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    console.log('delete project request is here', projectId);
    try {
        const result = yield projectService.removeProject(projectId);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(error instanceof Error && error.message === "Project not found" ? 400 : 500)
            .json({ message: error instanceof Error ? error.message : "Server error" });
    }
});
exports.deleteProject = deleteProject;
const projectlisting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        const result = yield projectService.getProjectsByManager(managerId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(error instanceof Error &&
            (error.message === "Department Not found" || error.message === "Project details not found")
            ? 400 : 500)
            .json({ message: error instanceof Error ? error.message : "Server error" });
    }
});
exports.projectlisting = projectlisting;
const listTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const result = yield projectService.getTasksByProject(projectId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(error instanceof Error && error.message === "No tasks found" ? 400 : 500)
            .json({ message: error instanceof Error ? error.message : "Server error" });
    }
});
exports.listTasks = listTasks;
