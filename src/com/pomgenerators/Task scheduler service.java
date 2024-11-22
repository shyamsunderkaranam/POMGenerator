import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Service
public class TaskSchedulerService {
    private final ThreadPoolTaskScheduler taskScheduler;
    private final Map<String, ScheduledFuture<?>> tasks = new ConcurrentHashMap<>();

    public TaskSchedulerService() {
        this.taskScheduler = new ThreadPoolTaskScheduler();
        this.taskScheduler.setPoolSize(10);
        this.taskScheduler.initialize();
    }

    public void scheduleTask(String taskId, Runnable task, LocalDateTime dateTime) {
        Date scheduleTime = Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
        ScheduledFuture<?> scheduledTask = taskScheduler.schedule(task, scheduleTime);
        tasks.put(taskId, scheduledTask);
    }

    public void updateTask(String taskId, Runnable task, LocalDateTime newDateTime) {
        cancelTask(taskId);
        scheduleTask(taskId, task, newDateTime);
    }

    public void cancelTask(String taskId) {
        ScheduledFuture<?> scheduledTask = tasks.get(taskId);
        if (scheduledTask != null) {
            scheduledTask.cancel(true);
            tasks.remove(taskId);
        }
    }
}