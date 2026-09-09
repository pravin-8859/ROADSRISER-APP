import ContactMessage from "../models/ContactMessage.js";

export const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      message
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required"
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      service,
      message
    });

    return res.status(201).json({
      message: "Contact message submitted successfully",
      data: contactMessage
    });
  } catch (error) {
    console.error("Create contact message error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      messages
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateContactMessageStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const updatedMessage =
      await ContactMessage.findByIdAndUpdate(
        id,
        {
          status
        },
        {
          new: true
        }
      );

    if (!updatedMessage) {
      return res.status(404).json({
        message: "Contact message not found"
      });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      data: updatedMessage
    });
  } catch (error) {
    console.error("Update contact status error:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};