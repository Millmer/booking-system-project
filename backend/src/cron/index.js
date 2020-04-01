const cron   = require('node-cron');
const bent   = require('bent');
const Services = require('../services');
const { sendBookingsOfTheDay, sendBookingReminders, sendPostBookingEmails } = require('./booking-crons');

class ActionHandler {
  constructor () {
    console.info('Setting up cron');
    this.isMaster = false;        // Start as follower
    this.metadata = {};           // Default to empty
    this.heartbeat = 120          // 2 minute heartbeat
    this.startedAt = new Date();  // Default started at to when app.js wasr run. Updated later.
    this.getContainerMetadata();  // Get metadata
    this.start();                 // Start polling for master status

    // Send daily booking emails @ 6AM UTC to hosts who have opted in
    cron.schedule('0 0 6 * * *', async () => {
      if (this.isMaster) {
        console.info('Sending daily booking emails...');
        try {
          await sendBookingsOfTheDay();
        } catch (error) {
          console.error('Failed to send daily booking emails.');
          console.error(error);
        }
      }
    });

    // Send booking reminders @ 11AM UTC 2 days before each booking.
    cron.schedule('0 0 11 * * *', async () => {
      if (this.isMaster) {
        console.info('Sending booking reminder emails...');
        try {
          await sendBookingReminders();
        } catch (error) {
          console.error('Failed to send booking reminder emails.');
          console.error(error);
        }
      }
    });

    // Send post-booking emails 1 hour after each booking completes and complete the booking.
    cron.schedule('0 0 7-20 * * *', async () => {
      if (this.isMaster) {
        console.info('Checking for completed bookings...');
        try {
          await sendPostBookingEmails();
        } catch (error) {
          console.error('Failed to complete bookings');
          console.error(error);
        }
      }
    });
  }

  start () {
    setInterval(this.checkMasterStatus.bind(this), this.heartbeat * 1000);
  }

  async getContainerMetadata() {
    try {
      // Get container metadata
      const getJSON = bent('json');
      this.metadata = await getJSON(`${process.env.ECS_CONTAINER_METADATA_URI}/task`);
      // Can safely assume one container per task (besides AWS proxy containers - not NORMAL type)
      this.startedAt = new Date(this.metadata.Containers.filter(container => container.Type === 'NORMAL')[0].StartedAt);
      await this.checkMasterStatus();
    } catch (error) {
      console.error('Failed to get container metadata status. Defaulting to slave');
      console.error(error);
    }
  }

  async checkMasterStatus() {
    try {
      const wasMaster = this.isMaster;
      const tasks = await Services.Amazon.listRunningTasks({ cluster: this.metadata.Cluster, family: this.metadata.Family });
      const taskARNs = tasks.taskArns.filter(arn => arn !== this.metadata.TaskARN);

      if (taskARNs.length === 0) {
        // If the only container then it's master
        this.isMaster = true;
      } else {
        const taskMetadatas = await Services.Amazon.describeTasks({ cluster: this.metadata.Cluster, tasks: taskARNs });
        for (let i = 0; i < taskMetadatas.tasks.length; i++) {
          const task = taskMetadatas.tasks[i];
          const taskStartedAt = new Date(task.startedAt);
          if (taskStartedAt > this.startedAt) {
            this.isMaster = false;
            break;
          }
          this.isMaster = true;
        }
      }

      // If there was a state change, log it
      if (wasMaster !== this.isMaster) console.info('%s', this.isMaster ? 'Promoted to master' : 'Demoted to slave');

    } catch(error) {
      console.error('Failed to determine master status. Defaulting to slave');
      this.isMaster = false;
      console.error(error);
    }
  }
}

module.exports = new ActionHandler();
