const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../persistence/users');
const ResetToken = require('../../persistence/resetTokens');
const Email = require('../../email');

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) return res.status(400).json({ message: 'EMAIL_REQUIRED' });
      if (!password) return res.status(400).json({ message: 'PASSWORD_REQUIRED' });

      // Find the user associated with the email provided
      const user = await User.getByEmail(email);
      
      // Validate password and make sure it matches with the corresponding hash stored in the database
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'INCORRECT_PASSWORD' });
      
      // We don't want to store the sensitive information such as the
      // user password in the token so we pick only what we want
      const body = { id : user.id, email : user.email, role: user.role, first_name: user.first_name, last_name: user.last_name };
      // Sign the JWT token and populate the payload
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      //Send back the token to the user
      return res.status(200).json({ token });
    } catch (error) {
      if (error === 'USER_NOT_FOUND') return res.status(401).json({ message: error });
      return res.status(500).json({ message: 'An error occurred' });
    }
  },
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ message: 'EMAIL_REQUIRED' });

      // Find the user associated with the email provided
      const user = await User.getByEmail(email);

      // Expire any tokens that were previously set for this user to prevent old tokens from being used.
      await ResetToken.setUsed(email);
 
      // Create a random reset token
      const token = crypto.randomBytes(64).toString('base64');
 
      // Set token to expire after one hour
      const expiration_date = new Date();
      expiration_date.setHours(expiration_date.getHours() + 1);
    
      // Insert token data into DB
      await ResetToken.create({ email, expiration_date, token, used: 0 });
 
      // Send email
      const message = {
        name: user.first_name,
         url: `${process.env.FRONTEND_PATH}/auth/reset?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
      };

      Email.send(email, 'forgot-password', message).catch(error => {
        console.error(`Error sending forgot password email for ${email}`);
        console.error(error);
      });

      return res.status(204).json();
    } catch (error) {
      if (error === 'USER_NOT_FOUND') return res.status(204).json();
      if (typeof error === 'string' && error.includes('NOT_FOUND')) return res.status(404).json({ message: error });
      console.error(`forgotPassword >> Error: ${error.stack}`);
      return res.status(500).json();
    }
  },
  async passwordReset(req, res) {
    try {
      // Cheeky clean up of old tokens in the database
      await ResetToken.destroyOld();

      const { email, password, token } = req.body;

      if (!email) return res.status(400).json({ message: 'EMAIL_REQUIRED' });
      if (!password) return res.status(400).json({ message: 'PASSWORD_REQUIRED' });
      if (!token) return res.status(400).json({ message: 'TOKEN_REQUIRED' });

      const user = await User.getByEmail(email);

      const tokenRecord = await ResetToken.findValid({ email, token });

      if (!tokenRecord) return res.status(404).json({ message: 'TOKEN_NOT_FOUND' });

      await ResetToken.setUsed(email);

      const newPassword = await bcrypt.hash(password, 10);
      await User.update(user.id, { password: newPassword });

      // Send email
      const message = {
        name: user.first_name
      };

      Email.send(email, 'password-reset-success', message).catch(error => {
        console.error(`Error sending password reset email for ${email}`);
        console.error(error);
      });

      return res.status(204).json();
    } catch (error) {
      if (error === 'USER_NOT_FOUND') return res.status(204).json();
      if (typeof error === 'string' && error.includes('NOT_FOUND')) return res.status(404).json({ message: error });
      console.error(`passwordReset >> Error: ${error.stack}`);
      return res.status(500).json();
    }
  }
};