import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/scheduler")
public class SchedulerController {
    @Autowired
    private TaskSchedulerService schedulerService;

    @PostMapping("/schedule")
    public String scheduleTask(@RequestParam String taskId, 
                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        schedulerService.scheduleTask(taskId, () -> System.out.println("Executing task " + taskId + " at " + dateTime), dateTime);
        return "Task scheduled: " + taskId + " at " + dateTime;
    }

    @PutMapping("/update")
    public String updateTask(@RequestParam String taskId, 
                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDateTime) {
        schedulerService.updateTask(taskId, () -> System.out.println("Updated task " + taskId + " at " + newDateTime), newDateTime);
        return "Task updated: " + taskId + " to run at " + newDateTime;
    }

    @DeleteMapping("/cancel")
    public String cancelTask(@RequestParam String taskId) {
        schedulerService.cancelTask(taskId);
        return "Task canceled: " + taskId;
    }
}