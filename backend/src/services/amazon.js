const AWS = require('aws-sdk');

class Amazon {
  get SDK () { return AWS; }

  constructor () {
    AWS.config.region = 'eu-central-1';

    this.ECS = new AWS.ECS({ region: AWS.config.region });
  }

  // ================= ECS FUNCTIONS =============================

  async listRunningTasks (params) {
    params = {...params, desiredStatus: 'RUNNING' };
    return await this.ECS.listTasks(params).promise();
  }

  async describeTasks (params) {
    return await this.ECS.describeTasks(params).promise();
  }

  // ================= SES FUNCTIONS =============================
  async sendEmail (params) {
    const ses = new AWS.SES({ region: AWS.config.region });
    return await ses.sendEmail(params).promise();
  }

  // ================= S3 FUNCTIONS =============================
  async createPresignedPost (params) {
    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3({ region: AWS.config.region });
      return s3.createPresignedPost(params, (err, data) => err ? reject(err) : resolve(data));
    });
  }
};

module.exports = new Amazon();