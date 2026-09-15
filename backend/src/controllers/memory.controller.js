import Memory from '../models/memory.model.js';

export async function uploadMemory(req, res) {
  try {
    const { patientId, title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUrl = req.file.path;

    const memory = await Memory.create({
      patientId,
      caretakerId: req.user._id,
      imageUrl,
      title,
      description
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error('Error uploading memory:', error);
    res.status(500).json({ error: 'Server error uploading memory' });
  }
}

export async function getLatestMemory(req, res) {
  try {
    const { patientId } = req.params;
    
    const memory = await Memory.findOne({ patientId }).sort({ date: -1, createdAt: -1 });
    
    if (!memory) {
      return res.status(200).json(null);
    }

    res.status(200).json(memory);
  } catch (error) {
    console.error('Error fetching memory:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
