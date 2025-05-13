// BookingTask.java (Entity to track scheduled tasks) @Entity public class BookingTask { @Id private String bookingRef;

private LocalDateTime startTime;
private LocalDateTime endTime;
private String hash; // hash to detect changes

// getters and setters

}

// QuartzConfig.java @Configuration public class QuartzConfig {

@Bean
public JobDetailFactoryBean bookingStartJobDetail() {
    JobDetailFactoryBean factory = new JobDetailFactoryBean();
    factory.setJobClass(BookingStartJob.class);
    factory.setDurability(true);
    return factory;
}

@Bean
public SchedulerFactoryBean schedulerFactoryBean(DataSource dataSource) {
    SchedulerFactoryBean factory = new SchedulerFactoryBean();
    factory.setDataSource(dataSource);
    factory.setOverwriteExistingJobs(true);
    factory.setJobFactory(springBeanJobFactory());
    return factory;
}

@Bean
public SpringBeanJobFactory springBeanJobFactory() {
    AutoWiringSpringBeanJobFactory jobFactory = new AutoWiringSpringBeanJobFactory();
    jobFactory.setApplicationContext(applicationContext);
    return jobFactory;
}

@Autowired
private ApplicationContext applicationContext;

}

// BookingStartJob.java public class BookingStartJob implements Job { @Override public void execute(JobExecutionContext context) { JobDataMap dataMap = context.getJobDetail().getJobDataMap(); String bookingRef = dataMap.getString("bookingRef"); System.out.println("Executing start task for: " + bookingRef); } }

// BookingService.java @Service public class BookingService {

@Autowired
private Scheduler scheduler;

@Autowired
private BookingTaskRepository taskRepo;

public void processBookingRecord(BookingRecord record) throws Exception {
    Optional<BookingTask> existing = taskRepo.findById(record.getBookingRef());
    String newHash = computeHash(record);

    if (existing.isEmpty()) {
        scheduleBookingJobs(record);
    } else {
        BookingTask task = existing.get();
        if (!task.getHash().equals(newHash)) {
            rescheduleJobs(record);
        }
    }
}

public void scheduleBookingJobs(BookingRecord record) throws Exception {
    JobDataMap jobDataMap = new JobDataMap();
    jobDataMap.put("bookingRef", record.getBookingRef());

    JobDetail startJob = JobBuilder.newJob(BookingStartJob.class)
            .withIdentity(record.getBookingRef() + "_start")
            .setJobData(jobDataMap)
            .build();

    Trigger startTrigger = TriggerBuilder.newTrigger()
            .withIdentity(record.getBookingRef() + "_start_trigger")
            .startAt(Date.from(record.getStartTime().atZone(ZoneId.systemDefault()).toInstant()))
            .build();

    scheduler.scheduleJob(startJob, startTrigger);

    // Repeat the above for end time with a BookingEndJob class

    BookingTask task = new BookingTask();
    task.setBookingRef(record.getBookingRef());
    task.setStartTime(record.getStartTime());
    task.setEndTime(record.getEndTime());
    task.setHash(computeHash(record));
    taskRepo.save(task);
}

public void rescheduleJobs(BookingRecord record) throws Exception {
    scheduler.deleteJob(JobKey.jobKey(record.getBookingRef() + "_start"));
    // delete end job too
    scheduleBookingJobs(record);
}

private String computeHash(BookingRecord record) {
    return Integer.toHexString(Objects.hash(record.getStartTime(), record.getEndTime(), record.getFlags()));
}

}

// BookingPoller.java @Component public class BookingPoller { @Autowired private BookingService bookingService;

@Scheduled(fixedRateString = "${booking.fetch.interval.ms:900000}")
public void fetchAndSchedule() {
    List<BookingRecord> bookings = restClient.fetchRecords();
    bookings.forEach(record -> {
        try {
            bookingService.processBookingRecord(record);
        } catch (Exception e) {
            e.printStackTrace();
        }
    });
}

}

// BookingRecord.java (DTO) public class BookingRecord { private String bookingRef; private LocalDateTime startTime; private LocalDateTime endTime; private String flags; // getters and setters }

