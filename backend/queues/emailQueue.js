const Queue = require('bull');
const sendEmail = require('../helpers/sendEmail');

const emailQueue = new Queue('email transcoding', { 
    redis: { port: 6379, host: '127.0.0.1' } 
}); 

//loading ma kyr ag Queue ko use
//Queue ko use yin redis ko install a yin lote
emailQueue.process(async(job) => {
  //recipe new create p tgi users tway ko mail po ag lote mal
            //po reality san ag 5sec wait p mha email send khaine
            setTimeout(async() => {
                await sendEmail(job.data)
            }, 5000);
})

module.exports = emailQueue;