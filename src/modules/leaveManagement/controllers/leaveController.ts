import { Request, Response } from "express"
import Leave from "../models/leaveModel"
import User from "../../employee/models/userModel";

export const createLeave = async(req:Request,res:Response)=>{
    console.log('1');
    
    try {
        const {userId,leaveType,startDate,endDate,reason} = req.body;
        
        if (!userId || !leaveType || !startDate || !endDate || !reason) {
          res.status(400).json({ message: "All fields are required." });
          return 
            
          }

          const end = new Date (startDate);
          const start = new Date (endDate)

          const existLeave = await Leave.findOne({userId,
            $or:[
              {
                startDate:{$lte:end},
                endDate:{$gte:start}
              }
            ]
          })
          if(existLeave){
            return res.status(409).json({message:'Yor already have a leave applied during these dates'})
          }

          

          const newLeave = new Leave({
            userId:userId,
            leaveType,
            startDate:new Date(startDate),
            endDate:new Date(endDate),
            reason,
            createdAt:new Date()
          })
         

          const savedLeave = await newLeave.save()
          return res.status(201).json({
            message: "Leave request created successfully.",
          });
        

    } catch (error) {
        console.log('error',error);
        res.status(500).json({message:'Server error. Please try again later'})
        
    }
}


export const listingLeaves = async (req:Request,res:Response):Promise<void>=>{
  try {
    
    const LeavesLists = await Leave.find().populate('userId');
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
  const {action,userId} = req.body;
  const {leaveId} = req.params;
  console.log('status change request is here');
  console.log(leaveId);
  
  

 try {
  const userLeave = await Leave.findById(leaveId);

  if(!userLeave){
    res.status(404).json({message:'invalid action'})
    return
  }

  if (action === 'Approved') {
    userLeave.status = 'Approved';
  } else if (action === 'Rejected') {
    userLeave.status = 'Rejected';
  } else {
    res.status(400).json({ message: 'Invalid action.' });
    return;
  }

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

