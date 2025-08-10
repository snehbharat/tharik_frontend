export class ScheduleService {
  static SCHEDULES_KEY = "work_schedules";
  static EMPLOYEE_SCHEDULES_KEY = "employee_schedules";
  static EXCEPTIONS_KEY = "schedule_exceptions";

  static async createSchedule(scheduleData) {
    try {
      const schedule = {
        ...scheduleData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const schedules = this.getWorkSchedules();
      schedules.push(schedule);
      localStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(schedules));

      console.log("Schedule created:", schedule);
      return schedule;
    } catch (error) {
      console.error("Create schedule failed:", error);
      throw error;
    }
  }

  static async assignScheduleToEmployee(employeeId, scheduleId, effectiveDate) {
    try {
      const employeeSchedules = this.getEmployeeSchedules();
      const activeSchedules = employeeSchedules.filter(
        (es) => es.employeeId === employeeId && es.isActive
      );

      activeSchedules.forEach((schedule) => {
        schedule.isActive = false;
        schedule.endDate = effectiveDate;
      });

      const assignment = {
        id: this.generateId(),
        employeeId,
        scheduleId,
        effectiveDate,
        isActive: true,
        createdAt: new Date(),
      };

      employeeSchedules.push(assignment);
      localStorage.setItem(
        this.EMPLOYEE_SCHEDULES_KEY,
        JSON.stringify(employeeSchedules)
      );

      console.log("Schedule assigned:", assignment);
      return assignment;
    } catch (error) {
      console.error("Schedule assignment failed:", error);
      throw error;
    }
  }

  static async getEmployeeSchedule(employeeId, date) {
    try {
      const checkDate = date ? new Date(date) : new Date();
      const employeeSchedules = this.getEmployeeSchedules();
      const workSchedules = this.getWorkSchedules();

      const activeAssignment = employeeSchedules.find((es) => {
        if (es.employeeId !== employeeId || !es.isActive) return false;

        const effectiveDate = new Date(es.effectiveDate);
        const endDate = es.endDate ? new Date(es.endDate) : null;

        return checkDate >= effectiveDate && (!endDate || checkDate <= endDate);
      });

      if (!activeAssignment) return null;

      return (
        workSchedules.find((ws) => ws.id === activeAssignment.scheduleId) ||
        null
      );
    } catch (error) {
      console.error("Get employee schedule failed:", error);
      return null;
    }
  }

  static async isScheduledToWork(employeeId, dateTime) {
    try {
      const schedule = await this.getEmployeeSchedule(
        employeeId,
        dateTime.toISOString().split("T")[0]
      );
      if (!schedule) return false;

      const dayOfWeek = dateTime.getDay() || 7;
      if (!schedule.workDays.includes(dayOfWeek)) return false;

      const exceptions = this.getScheduleExceptions();
      const dateString = dateTime.toISOString().split("T")[0];
      const hasException = exceptions.some(
        (ex) =>
          (ex.employeeId === employeeId || ex.scheduleId === schedule.id) &&
          ex.exceptionDate === dateString
      );

      if (hasException) return false;

      if (
        schedule.scheduleType === "fixed" &&
        schedule.startTime &&
        schedule.endTime
      ) {
        const currentTime = dateTime.toTimeString().substr(0, 5);
        return (
          currentTime >= schedule.startTime && currentTime <= schedule.endTime
        );
      }

      return true;
    } catch (error) {
      console.error("Check scheduled work failed:", error);
      return false;
    }
  }

  static async calculateExpectedHours(employeeId, startDate, endDate) {
    try {
      const schedule = await this.getEmployeeSchedule(employeeId, startDate);
      if (!schedule) return 0;

      const start = new Date(startDate);
      const end = new Date(endDate);
      let expectedHours = 0;

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const isWorkDay = await this.isScheduledToWork(employeeId, date);
        if (isWorkDay) {
          if (
            schedule.scheduleType === "fixed" &&
            schedule.startTime &&
            schedule.endTime
          ) {
            const startTime = this.parseTime(schedule.startTime);
            const endTime = this.parseTime(schedule.endTime);
            const dailyHours =
              (endTime - startTime) / (1000 * 60 * 60) -
              schedule.breakDuration / 60;
            expectedHours += Math.max(0, dailyHours);
          } else {
            expectedHours += 8;
          }
        }
      }

      return expectedHours;
    } catch (error) {
      console.error("Calculate expected hours failed:", error);
      return 0;
    }
  }

  static async addScheduleException(exceptionData) {
    try {
      const exception = {
        ...exceptionData,
        id: this.generateId(),
        createdAt: new Date(),
      };

      const exceptions = this.getScheduleExceptions();
      exceptions.push(exception);
      localStorage.setItem(this.EXCEPTIONS_KEY, JSON.stringify(exceptions));

      return exception;
    } catch (error) {
      console.error("Add schedule exception failed:", error);
      throw error;
    }
  }

  static getWorkSchedules() {
    try {
      const schedules = localStorage.getItem(this.SCHEDULES_KEY);
      return schedules ? JSON.parse(schedules) : [];
    } catch (error) {
      console.error("Error loading work schedules:", error);
      return [];
    }
  }

  static getEmployeeSchedules() {
    try {
      const schedules = localStorage.getItem(this.EMPLOYEE_SCHEDULES_KEY);
      return schedules ? JSON.parse(schedules) : [];
    } catch (error) {
      console.error("Error loading employee schedules:", error);
      return [];
    }
  }

  static getScheduleExceptions() {
    try {
      const exceptions = localStorage.getItem(this.EXCEPTIONS_KEY);
      return exceptions ? JSON.parse(exceptions) : [];
    } catch (error) {
      console.error("Error loading schedule exceptions:", error);
      return [];
    }
  }

  static parseTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date().setHours(hours, minutes, 0, 0);
  }

  static generateId() {
    return `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
