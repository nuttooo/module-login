import mongoose from 'mongoose'

const VerificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
})

const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', VerificationTokenSchema)
export default VerificationToken
