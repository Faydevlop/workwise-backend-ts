import { Request, Response } from "express"
import Leave from "../models/leaveModel"
import User from "../../employee/models/userModel";
import Department from "../../Department/model/departmentModel";

import nodemailer from "nodemailer";
import Admin from "../../admin/models/adminModel";
import { io } from "../../../app";
import notificationModel from "../../notification/model/notificationModel";

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAILPASS,
  },
});

export const createLeave = async (req: Request, res: Response) => {

  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const end = new Date(startDate);
    const start = new Date(endDate);

    const existLeave = await Leave.findOne({
      userId,
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    });

    if (existLeave) {
      return res.status(409).json({ message: 'You already have a leave applied during these dates' });
    }

    const lastLeave = await Leave.findOne({ userId }).sort({ createdAt: -1 });

    if (lastLeave) {
      const now = new Date();
      if (lastLeave.lastResetDate.getMonth() !== now.getMonth()) {
        lastLeave.monthlyLeaveCount = 0;
        lastLeave.lastResetDate = now;
      }

      if (lastLeave.monthlyLeaveCount >= 4) {
        return res.status(403).json({ message: 'You have reached your leave limit for this month' });
      }

      lastLeave.monthlyLeaveCount += 1;
      await lastLeave.save();
    }

    const newLeave = new Leave({
      userId: userId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      createdAt: new Date(),
      monthlyLeaveCount: lastLeave ? lastLeave.monthlyLeaveCount : 1,
      lastResetDate: lastLeave ? lastLeave.lastResetDate : new Date(),
    });

    const userdata = await User.findById(userId)

    const savedLeave = await newLeave.save();

     // Retrieve admin emails
     const admins = await Admin.find({}, 'email');
     const adminEmails = admins.map(admin => admin.email);
 
     // Retrieve HR emails
     const hrUsers = await User.find({position:'HR'}) // Assuming there's an HR model
     const hrEmails = hrUsers.map(hr => hr.email);
 
     // Combine admin and HR emails
     const recipients = [...adminEmails, ...hrEmails]; 
 
     if (recipients.length === 0) {
       console.log('No admin or HR emails found.');
       return res.status(201).json({
         message: "Leave request created successfully, but no admin or HR emails found.",
       });
     }
 

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients, // Change this to the recipient's email
      subject: `Leave Request from ${userdata?.firstName}${userdata?.lastName}`,
      text: `
Dear HR/Admin Team,

I hope this message finds you well.

Please be informed that a new leave request has been submitted with the following details:

- **Employee Name**: ${userdata?.firstName} ${userdata?.lastName}
- **Position**: ${userdata?.position}
- **Employee ID**: ${userId}
- **Leave Type**: ${leaveType}
- **Start Date**: ${startDate}
- **End Date**: ${endDate}
- **Reason for Leave**: ${reason}

Kindly review this request and proceed with the necessary actions.

Thank you for your attention to this matter.

Best regards,  
${userdata?.firstName} ${userdata?.lastName}
`

    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(201).json({
      message: "Leave request created successfully and email sent.",
    });
    
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



export const listingLeaves = async (req:Request,res:Response):Promise<void>=>{
  try {
    
    const LeavesLists = await Leave.find({isChanged:false}).populate('userId');
    if(!LeavesLists){
      res.status(400).json({message:'Leave Requests is empty'})
      return
    }

    res.status(200).json({leaves:LeavesLists});

  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Error fetching leave Requests'})
    
  }
}

export const listingleavesforUser = async (req:Request,res:Response):Promise<void>=>{
  try {
    const {userId } = req.params;
    const userLeavelist = await Leave.find({userId:userId}).populate('userId')

    if(!userLeavelist){
      res.status(400).json({message:'User Dont have Leave Requests'});
      return
    }

    res.status(200).json({leaves:userLeavelist});


  } catch (error) {
    console.log(error);
    res.status(400).json({message:'Error fething leave requests'})
    
    
  }
}


export const listdetails = async(req:Request,res:Response):Promise<void>=>{
  try {
    const {leaveId} = req.params
    const details = await Leave.findById(leaveId).populate('userId')

    if(!details){
      res.status(400).json({message:'details not found'})
      return
    }

    res.status(200).json({leave:details})


  } catch (error) {
    
  }
}

export const changeStatus = async(req:Request,res:Response):Promise<void>=>{
  const {action,userId,comment} = req.body;
  const {leaveId} = req.params;
  console.log('status change request is her mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmme');
  console.log(leaveId);
  
  

 try {
  const userLeave = await Leave.findById(leaveId);

  if(!userLeave){
    res.status(404).json({message:'invalid action'})
    return
  }
  const user = userLeave.userId.toString()


  
  const newNotification = new notificationModel({
  
    receiver: user,
    type: 'message',
    message: `Your Leave Request Is : ${action} Date:${new Date(userLeave.startDate).toLocaleDateString()} to ${new Date(userLeave.endDate).toLocaleDateString()}`,
});



await newNotification.save();
io.to(user).emit('newNotification', newNotification);

  if (action === 'Approved') {
   
    userLeave.status = 'Approved';
    userLeave.isChanged = true;
   
  } else if (action === 'Rejected') {
    userLeave.comment = comment || '';
    userLeave.monthlyLeaveCount -= 1
    userLeave.status = 'Rejected';
    userLeave.isChanged = true;
  } else {
    res.status(400).json({ message: 'Invalid action.' });
    return;
  }
  console.log('res is here 1');

  

  await userLeave.save();

  res.status(200).json({message:`Leave status has been Updated`})
 } catch (error) {
  res.status(500).json({message:'Error updateing status'})
 }




}

export const leavepageListingdatas = async(req:Request,res:Response):Promise<void>=>{

try {
    // list of all employees
    const totalEmployees = await User.countDocuments();

    // list of working emplyee
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workingEmployees = await Leave.countDocuments({
      $or:[
        {startDate:{$gt:today}},
        {endDate:{$lt:today}}
      ],
    
    })

    const notWorkingempo = await Leave.countDocuments({status:'Approved'})
  
    // pending leave Requests
    const pendingLeaveRequest = await Leave.countDocuments({status:'Pending'});
  
    // list of current leave employees

    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const onLeaveToday = await Leave.find({
      startDate:{$lte:endOfDay},
      endDate:{$gte:startOfDay},
      status:'Approved'
    }).populate('userId')
  
    res.status(200).json({
      totalEmployees,
      workingEmployees:totalEmployees - notWorkingempo,
      pendingLeaveRequest,
      onLeaveToday
    })
  
} catch (error) {
  res.status(500).json({ message: 'Error fetching leave page data', error });
}


}

export const managerLeaveMng = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerId } = req.params;
    console.log('request is here');

    const managerDetails = await User.findById(managerId);
    if (!managerDetails) {
      res.status(404).json({ message: 'Manager not found' });
      return;
    }

    const managerDepId = managerDetails.department;
    const users = await User.find({ department: managerDepId, position: 'Employee' });
    
    if (!users || users.length === 0) {
      res.status(400).json({ message: 'No Users Found' });
      return;
    }

    const userIds = users.map(user => user._id); // Collect all user IDs
    const leaves = await Leave.find({ userId: { $in: userIds } }).populate('userId') // Find leaves for all users

    res.status(200).json({ leaves });
    
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'Server Error' });
  }
}


