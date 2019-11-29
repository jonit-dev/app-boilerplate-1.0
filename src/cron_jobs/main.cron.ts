import cron from 'node-cron';

export class MainCron {
  public static sampleCron() {
    console.log("starting MainCron...");
    cron.schedule("* * * * *", function() {
      console.log("This is a cron sample");
    });
  }
}
