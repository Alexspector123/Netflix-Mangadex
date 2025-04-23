import { User } from '../models/User.js';

export const updateVipStatus = async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ msg: 'Missing userId' });
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role: 'vip' },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.status(200).json({ msg: 'Upgrade success', user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  
