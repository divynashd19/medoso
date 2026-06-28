const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const normalizeEmail = (email) => (email || '').toLowerCase().trim();
const memoryUsers = new Map();
const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    phone: String,
    specialization: String,
    bio: String,
    profilePicture: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.statics.createUser = async function (data) {
  if (!isDatabaseConnected()) {
    const email = normalizeEmail(data.email);
    if (memoryUsers.has(email)) {
      const error = new Error('User already exists with this email');
      error.code = 11000;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = {
      _id: new mongoose.Types.ObjectId().toString(),
      id: new mongoose.Types.ObjectId().toString(),
      name: data.name,
      email,
      password: hashedPassword,
      role: data.role || 'patient',
      phone: data.phone,
      specialization: data.specialization,
      bio: data.bio,
      profilePicture: data.profilePicture,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryUsers.set(email, user);
    return user;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  return this.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'patient',
    phone: data.phone,
    specialization: data.specialization,
    bio: data.bio,
    profilePicture: data.profilePicture,
    isActive: data.isActive !== undefined ? data.isActive : true,
  });
};

userSchema.statics.findByEmail = async function (email) {
  if (!isDatabaseConnected()) {
    return memoryUsers.get(normalizeEmail(email)) || null;
  }

  return this.findOne({ email: normalizeEmail(email) });
};

userSchema.statics.getDoctors = async function () {
  if (!isDatabaseConnected()) {
    return Array.from(memoryUsers.values())
      .filter((user) => user.role === 'doctor' && user.isActive !== false)
      .map((user) => ({ ...user }));
  }

  return this.find({ role: 'doctor', isActive: true }).select('-password');
};

userSchema.statics.comparePassword = async function (plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
};

userSchema.statics.updateById = async function (id, updates) {
  if (!isDatabaseConnected()) {
    const user = Array.from(memoryUsers.values()).find((entry) => entry._id === id || entry.id === id);
    if (!user) {
      return null;
    }

    Object.assign(user, updates, { updatedAt: new Date() });
    if (updates.email) {
      memoryUsers.delete(normalizeEmail(user.email));
      user.email = normalizeEmail(updates.email);
    }
    memoryUsers.set(normalizeEmail(user.email), user);
    return user;
  }

  return this.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
