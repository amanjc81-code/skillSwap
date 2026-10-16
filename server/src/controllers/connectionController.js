import { ConnectionRequest } from '../models/ConnectionRequest.js';
import { LearningConnection } from '../models/LearningConnection.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export const createConnectionRequest = async (req, res, next) => {
  try {
    const { recipientId, teachSkillId, learnSkillId, message, proposalType } = req.body;

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot send a learning request to yourself.' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient student not found.' });
    }

    // Check if recipient has blocked current user
    if (recipient.blockedUsers?.some((id) => id.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Unable to send request to this user.' });
    }

    // Check duplicate pending request
    const existing = await ConnectionRequest.findOne({
      sender: req.user._id,
      recipient: recipientId,
      status: 'pending'
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A pending request to this learning partner already exists.'
      });
    }

    const request = await ConnectionRequest.create({
      sender: req.user._id,
      recipient: recipientId,
      teachSkill: teachSkillId || undefined,
      learnSkill: learnSkillId,
      message: message || '',
      proposalType: proposalType || 'one-way',
      status: 'pending'
    });

    // Create notification for recipient
    await Notification.create({
      recipient: recipientId,
      type: 'connection_request',
      title: 'New Learning Partner Request',
      message: `${req.user.name} sent you a ${proposalType === 'reciprocal' ? 'reciprocal skill exchange' : 'learning'} request!`,
      link: '/connections'
    });

    const populated = await ConnectionRequest.findById(request._id)
      .populate('sender', 'name department academicYear avatarUrl')
      .populate('recipient', 'name department academicYear avatarUrl')
      .populate('teachSkill', 'name category')
      .populate('learnSkill', 'name category');

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully.',
      request: populated
    });
  } catch (error) {
    next(error);
  }
};

export const getConnectionRequests = async (req, res, next) => {
  try {
    const incoming = await ConnectionRequest.find({
      recipient: req.user._id,
      status: 'pending'
    })
      .populate('sender', 'name department academicYear avatarUrl bio')
      .populate('teachSkill', 'name category')
      .populate('learnSkill', 'name category')
      .sort({ createdAt: -1 });

    const outgoing = await ConnectionRequest.find({
      sender: req.user._id
    })
      .populate('recipient', 'name department academicYear avatarUrl bio')
      .populate('teachSkill', 'name category')
      .populate('learnSkill', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      incoming,
      outgoing
    });
  } catch (error) {
    next(error);
  }
};

export const respondConnectionRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    const request = await ConnectionRequest.findOne({
      _id: id,
      recipient: req.user._id,
      status: 'pending'
    })
      .populate('sender')
      .populate('teachSkill')
      .populate('learnSkill');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Pending connection request not found or unauthorized.'
      });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // Find or create active LearningConnection
      let connection = await LearningConnection.findOne({
        participants: { $all: [request.sender._id, req.user._id] }
      });

      if (!connection) {
        connection = await LearningConnection.create({
          participants: [request.sender._id, req.user._id],
          connectionType: request.proposalType,
          primarySkillExchange: [
            {
              teacher: req.user._id,
              learner: request.sender._id,
              skill: request.learnSkill._id
            },
            ...(request.teachSkill
              ? [
                  {
                    teacher: request.sender._id,
                    learner: req.user._id,
                    skill: request.teachSkill._id
                  }
                ]
              : [])
          ],
          status: 'active',
          sharedGoals: [`Exchange skills in ${request.learnSkill.name}`]
        });
      } else {
        connection.status = 'active';
        await connection.save();
      }

      // Notify sender
      await Notification.create({
        recipient: request.sender._id,
        type: 'request_accepted',
        title: 'Connection Request Accepted!',
        message: `${req.user.name} accepted your learning partnership request. You can now schedule sessions together!`,
        link: '/connections'
      });

      return res.status(200).json({
        success: true,
        message: 'Connection request accepted! Learning partnership is now active.',
        connection
      });
    }

    res.status(200).json({
      success: true,
      message: 'Connection request declined.'
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveConnections = async (req, res, next) => {
  try {
    const connections = await LearningConnection.find({
      participants: req.user._id,
      status: 'active'
    })
      .populate('participants', 'name department academicYear avatarUrl bio email')
      .populate('primarySkillExchange.skill', 'name category')
      .populate('sharedResources.addedBy', 'name')
      .populate('sessionNotesHistory.author', 'name')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      connections
    });
  } catch (error) {
    next(error);
  }
};

export const addConnectionResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;

    const connection = await LearningConnection.findOne({
      _id: id,
      participants: req.user._id
    });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection not found or unauthorized' });
    }

    connection.sharedResources.push({
      title: title.trim(),
      url: url.trim(),
      addedBy: req.user._id,
      addedAt: new Date()
    });

    await connection.save();

    res.status(200).json({
      success: true,
      message: 'Resource added to shared learning workspace.',
      connection
    });
  } catch (error) {
    next(error);
  }
};
