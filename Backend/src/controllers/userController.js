const { prisma } = require('../config/prisma');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    if (user) {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name: req.body.name || user.name,
                email: req.body.email || user.email,
                // Add password update logic here if needed in future
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteUser = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    if (user) {
        await prisma.user.delete({
            where: { id: req.user.id }
        });
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUser
};
