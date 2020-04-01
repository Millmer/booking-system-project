const User = require('../../persistence/users');

module.exports = {
  async list (req, res) {
    try {
      if (req.user.role === 'HOST') {
        const user = await User.get(req.user.id);
        delete user.password;
        return res.status(200).json([user]);
      } else {
        const users = await User.list();
        users.forEach(user => delete user.password);
        return res.status(200).json(users);
      }
    } catch (error) {
      console.error(`listUsers >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async get (req, res) {
    try {
      const userId = (req.user.role === 'HOST') ? req.user.id : req.params.id;
      if (!userId) {
        return res.status(400).json({message: 'UserId must be provided'});
      }

      const user = await User.get(userId);
      delete user.password;
      return res.status(200).json(user);
    } catch (error) {
      console.error(`getUser({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async create (req, res) {
    try {
      const { email, password, role, first_name, last_name, country_id, do_send_daily_booking_email } = req.body;
      if (!email || !password || !role) {
        return res.status(400).json({message: 'Email, Password and Role must be provided'});
      }

      const user = await User.create({ email, password, role, first_name, last_name, country_id, do_send_daily_booking_email });
      if (!user) {
        return res.status(400).json({message: 'User already exists'});
      }

      delete user.password;
      return res.status(200).json(user);
    } catch (error) {
      console.error(`createUser({ email: ${req.body.email} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async edit (req, res) {
    try {
      if (req.user.role === 'HOST' && req.user.id != req.params.id) return res.status(403).json({message: 'You do not have permission to modify this user'});
      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({message: 'UserId must be provided'});
      }

      let { email, role, first_name, last_name, country_id, do_send_daily_booking_email } = req.body;
      if (!email || !role) {
        return res.status(400).json({message: 'Email and Role must be provided'});
      }

      if (req.user.role === 'HOST') role = 'HOST';
      const user = await User.update(userId, { email, role, first_name, last_name, ...(req.user.role === 'ADMIN' && {country_id}), do_send_daily_booking_email });

      delete user.password;
      return res.status(200).json(user);
    } catch (error) {
      console.error(`editUser({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  },
  async destroy (req, res) {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({message: 'UserId must be provided'});
      }

      const user = await User.destroy(userId);

      delete user.password;
      return res.status(200).json(user);
    } catch (error) {
      console.error(`deleteUser({ id: ${req.params.id} }) >> Error: ${error.stack}`);
      res.status(500).json();
    }
  }
};