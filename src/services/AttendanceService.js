export class AttendanceService {
  static STORAGE_KEY = "attendance_records";

  /**
   * Add manual attendance record
   * @param record - Attendance record data
   * @returns Promise resolving to the added record
   */
  static async addAttendanceRecord(record) {
    try {
      const attendanceRecord = {
        ...record,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const records = this.getAttendanceRecords();
      records.push(attendanceRecord);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));

      console.log("Manual attendance record added:", attendanceRecord);
      return attendanceRecord;
    } catch (error) {
      console.error("Add attendance record failed:", error);
      throw error;
    }
  }

  /**
   * Update attendance record
   * @param recordId - Record ID
   * @param updates - Updates to apply
   * @returns Promise resolving to updated record
   */
  static async updateAttendanceRecord(recordId, updates) {
    try {
      const records = this.getAttendanceRecords();
      const recordIndex = records.findIndex((r) => r.id === recordId);

      if (recordIndex === -1) {
        throw new Error("Attendance record not found");
      }

      records[recordIndex] = {
        ...records[recordIndex],
        ...updates,
        updatedAt: new Date(),
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
      return records[recordIndex];
    } catch (error) {
      console.error("Update attendance record failed:", error);
      throw error;
    }
  }

  /**
   * Get attendance records for employee in date range
   */
  static getEmployeeAttendance(employeeId, startDate, endDate) {
    const records = this.getAttendanceRecords();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return records.filter((record) => {
      if (record.employeeId !== employeeId) return false;
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });
  }

  /**
   * Calculate attendance statistics for employee
   */
  static calculateAttendanceStats(employeeId, startDate, endDate) {
    const records = this.getEmployeeAttendance(employeeId, startDate, endDate);

    const totalHours = records.reduce(
      (sum, r) => sum + r.hoursWorked + r.overtimeHours,
      0
    );
    const regularHours = records.reduce((sum, r) => sum + r.hoursWorked, 0);
    const overtimeHours = records.reduce((sum, r) => sum + r.overtimeHours, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const presentDays = records.length;
    const absentDays = totalDays - presentDays;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    const averageHoursPerDay = presentDays > 0 ? totalHours / presentDays : 0;

    return {
      totalDays,
      presentDays,
      absentDays,
      totalHours,
      regularHours,
      overtimeHours,
      attendanceRate,
      averageHoursPerDay,
    };
  }

  // Helper methods
  static getAttendanceRecords() {
    try {
      const records = localStorage.getItem(this.STORAGE_KEY);
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error("Error loading attendance records:", error);
      return [];
    }
  }

  static generateId() {
    return `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
