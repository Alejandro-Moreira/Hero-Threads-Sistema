import Cliente from '../models/clientes.js';

// Update user activity
const updateActivity = async (req, res) => {
  const { userId } = req.body;
  
  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cliente = await Cliente.findById(userId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update last activity
    cliente.lastActivity = new Date();
    await cliente.save();

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating activity'
    });
  }
};

// Get user session info
const getSessionInfo = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const cliente = await Cliente.findById(userId);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const now = new Date();
    const lastActivity = cliente.lastActivity || now;
    const timeSinceLastActivity = now - lastActivity;
    const timeoutDuration = 15 * 60 * 1000; // 15 minutes
    const remainingTime = Math.max(0, timeoutDuration - timeSinceLastActivity);

    res.status(200).json({
      success: true,
      data: {
        lastActivity,
        remainingTime: Math.floor(remainingTime / 1000), // in seconds
        status: cliente.status
      }
    });
  } catch (error) {
    console.error('Error getting session info:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting session info'
    });
  }
};

export { updateActivity, getSessionInfo }; 