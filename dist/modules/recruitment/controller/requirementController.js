"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updataJonlist = exports.getUserData = exports.deleteJobapplications = exports.listspecific = exports.listIReq = exports.referJob = exports.deleteItem = exports.listrquirements = exports.createRecruitment = void 0;
const recruitmentService_1 = __importDefault(require("../services/recruitmentService"));
const createRecruitment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received data:', req.body);
    try {
        const result = yield recruitmentService_1.default.createRecruitment(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating job post:', error);
        if (error.message === 'All fields are required.') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});
exports.createRecruitment = createRecruitment;
const listrquirements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield recruitmentService_1.default.listRecruitments();
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No Job Listing found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});
exports.listrquirements = listrquirements;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        const result = yield recruitmentService_1.default.deleteRecruitment(listId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Unable to delete') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});
exports.deleteItem = deleteItem;
const referJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const resumeUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path; // Cloudinary file URL
        console.log('Resume URL:', resumeUrl);
        const referralData = Object.assign(Object.assign({}, req.body), { resumeUrl });
        const result = yield recruitmentService_1.default.referJob(referralData);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error referring job', error });
    }
});
exports.referJob = referJob;
const listIReq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield recruitmentService_1.default.listReferrals();
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No Job Listing found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Error listing job', error });
        }
    }
});
exports.listIReq = listIReq;
const listspecific = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reqId } = req.params;
        const result = yield recruitmentService_1.default.getReferralDetails(reqId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No data found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Error listing job', error });
        }
    }
});
exports.listspecific = listspecific;
const deleteJobapplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = req.params;
        console.log('delete req is here');
        const result = yield recruitmentService_1.default.deleteJobApplication(applicationId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'No application found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});
exports.deleteJobapplications = deleteJobapplications;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const result = yield recruitmentService_1.default.getJobDetails(jobId);
        res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Listing data not found') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});
exports.getUserData = getUserData;
const updataJonlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const result = yield recruitmentService_1.default.updateJobListing(jobId, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error updating job:', error);
        if (error.message === 'Job ID is required') {
            res.status(400).json({ message: error.message });
        }
        else if (error.message === 'Job not found') {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.updataJonlist = updataJonlist;
