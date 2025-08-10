export class LeaveService {
  static LEAVE_REQUESTS_KEY = "leave_requests";
  static LEAVE_BALANCES_KEY = "leave_balances";
  static LEAVE_TYPES_KEY = "leave_types";

  static initializeLeaveTypes() {
    const existingTypes = this.getLeaveTypes();
    if (existingTypes.length === 0) {
      const defaultTypes = [
        {
          id: "annual",
          name: "Annual Leave",
          description: "Yearly vacation allowance",
          maxDaysPerYear: 21,
          requiresApproval: true,
          advanceNoticeDays: 7,
          isPaid: true,
          carryOverAllowed: true,
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: "sick",
          name: "Sick Leave",
          description: "Medical leave for illness",
          maxDaysPerYear: 30,
          requiresApproval: false,
          advanceNoticeDays: 0,
          isPaid: true,
          carryOverAllowed: false,
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: "personal",
          name: "Personal Leave",
          description: "Personal time off",
          maxDaysPerYear: 5,
          requiresApproval: true,
          advanceNoticeDays: 3,
          isPaid: false,
          carryOverAllowed: false,
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: "emergency",
          name: "Emergency Leave",
          description: "Emergency family situations",
          requiresApproval: true,
          advanceNoticeDays: 0,
          isPaid: true,
          carryOverAllowed: false,
          isActive: true,
          createdAt: new Date(),
        },
      ];

      localStorage.setItem(this.LEAVE_TYPES_KEY, JSON.stringify(defaultTypes));
    }
  }

  static async submitLeaveRequest(leaveData) {
    try {
      const startDate = new Date(leaveData.startDate);
      const endDate = new Date(leaveData.endDate);

      if (startDate >= endDate) {
        throw new Error("End date must be after start date");
      }

      const totalDays = await this.calculateLeaveDays(
        leaveData.startDate,
        leaveData.endDate
      );

      const balance = await this.getEmployeeLeaveBalance(
        leaveData.employeeId,
        startDate.getFullYear()
      );
      const leaveTypeBalance = balance.find(
        (b) => b.leaveTypeId === leaveData.leaveTypeId
      );

      if (leaveTypeBalance && leaveTypeBalance.remainingDays < totalDays) {
        throw new Error("Insufficient leave balance");
      }

      const existingRequests = this.getLeaveRequests();
      const overlapping = existingRequests.some(
        (req) =>
          req.employeeId === leaveData.employeeId &&
          req.status !== "rejected" &&
          req.status !== "cancelled" &&
          ((new Date(req.startDate) <= startDate &&
            new Date(req.endDate) >= startDate) ||
            (new Date(req.startDate) <= endDate &&
              new Date(req.endDate) >= endDate) ||
            (new Date(req.startDate) >= startDate &&
              new Date(req.endDate) <= endDate))
      );

      if (overlapping) {
        throw new Error("Overlapping leave request exists");
      }

      const leaveRequest = {
        ...leaveData,
        id: this.generateId(),
        totalDays,
        status: "pending",
        requestedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const requests = this.getLeaveRequests();
      requests.push(leaveRequest);
      localStorage.setItem(this.LEAVE_REQUESTS_KEY, JSON.stringify(requests));

      if (leaveTypeBalance) {
        leaveTypeBalance.pendingDays += totalDays;
        this.updateLeaveBalance(leaveTypeBalance);
      }

      console.log("Leave request submitted:", leaveRequest);
      return leaveRequest;
    } catch (error) {
      console.error("Submit leave request failed:", error);
      throw error;
    }
  }

  static async processLeaveRequest(requestId, approverId, decision, reason) {
    try {
      const requests = this.getLeaveRequests();
      const requestIndex = requests.findIndex((r) => r.id === requestId);

      if (requestIndex === -1) {
        throw new Error("Leave request not found");
      }

      const request = requests[requestIndex];
      if (request.status !== "pending") {
        throw new Error("Leave request already processed");
      }

      requests[requestIndex] = {
        ...request,
        status: decision,
        approvedBy: approverId,
        approvedAt: new Date(),
        rejectionReason: decision === "rejected" ? reason : undefined,
        updatedAt: new Date(),
      };

      localStorage.setItem(this.LEAVE_REQUESTS_KEY, JSON.stringify(requests));

      const balance = await this.getEmployeeLeaveBalance(
        request.employeeId,
        new Date(request.startDate).getFullYear()
      );
      const leaveTypeBalance = balance.find(
        (b) => b.leaveTypeId === request.leaveTypeId
      );

      if (leaveTypeBalance) {
        leaveTypeBalance.pendingDays -= request.totalDays;

        if (decision === "approved") {
          leaveTypeBalance.usedDays += request.totalDays;
        }

        this.updateLeaveBalance(leaveTypeBalance);
      }

      console.log("Leave request processed:", requests[requestIndex]);
      return requests[requestIndex];
    } catch (error) {
      console.error("Process leave request failed:", error);
      throw error;
    }
  }

  static async getEmployeeLeaveBalance(employeeId, year) {
    try {
      const balances = this.getLeaveBalances();
      let employeeBalances = balances.filter(
        (b) => b.employeeId === employeeId && b.year === year
      );

      if (employeeBalances.length === 0) {
        const leaveTypes = this.getLeaveTypes();
        employeeBalances = leaveTypes.map((type) => ({
          id: this.generateId(),
          employeeId,
          leaveTypeId: type.id,
          year,
          allocatedDays: type.maxDaysPerYear || 0,
          usedDays: 0,
          pendingDays: 0,
          remainingDays: type.maxDaysPerYear || 0,
          carryOverDays: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        balances.push(...employeeBalances);
        localStorage.setItem(this.LEAVE_BALANCES_KEY, JSON.stringify(balances));
      }

      return employeeBalances;
    } catch (error) {
      console.error("Get employee leave balance failed:", error);
      return [];
    }
  }

  static async calculateLeaveDays(startDate, endDate, excludeHolidays = true) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let businessDays = 0;

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        if (excludeHolidays) {
          const isHoliday = await this.isCompanyHoliday(
            date.toISOString().split("T")[0]
          );
          if (isHoliday) continue;
        }

        businessDays++;
      }

      return businessDays;
    } catch (error) {
      console.error("Calculate leave days failed:", error);
      return 0;
    }
  }

  static async getPendingApprovals(approverId) {
    try {
      const requests = this.getLeaveRequests();
      return requests.filter((r) => r.status === "pending");
    } catch (error) {
      console.error("Get pending approvals failed:", error);
      return [];
    }
  }

  static getEmployeeLeaveRequests(employeeId, year) {
    const requests = this.getLeaveRequests();
    return requests.filter((r) => {
      if (r.employeeId !== employeeId) return false;
      if (year) {
        const requestYear = new Date(r.startDate).getFullYear();
        return requestYear === year;
      }
      return true;
    });
  }

  static getLeaveRequests() {
    try {
      const requests = localStorage.getItem(this.LEAVE_REQUESTS_KEY);
      return requests ? JSON.parse(requests) : [];
    } catch (error) {
      console.error("Error loading leave requests:", error);
      return [];
    }
  }

  static getLeaveBalances() {
    try {
      const balances = localStorage.getItem(this.LEAVE_BALANCES_KEY);
      return balances ? JSON.parse(balances) : [];
    } catch (error) {
      console.error("Error loading leave balances:", error);
      return [];
    }
  }

  static getLeaveTypes() {
    try {
      const types = localStorage.getItem(this.LEAVE_TYPES_KEY);
      return types ? JSON.parse(types) : [];
    } catch (error) {
      console.error("Error loading leave types:", error);
      return [];
    }
  }

  static updateLeaveBalance(balance) {
    const balances = this.getLeaveBalances();
    const index = balances.findIndex((b) => b.id === balance.id);

    if (index !== -1) {
      balance.remainingDays =
        balance.allocatedDays - balance.usedDays - balance.pendingDays;
      balance.updatedAt = new Date();
      balances[index] = balance;
      localStorage.setItem(this.LEAVE_BALANCES_KEY, JSON.stringify(balances));
    }
  }

  static async isCompanyHoliday(date) {
    const holidays = ["2024-01-01", "2024-09-23", "2024-12-25"];

    return holidays.includes(date);
  }

  static generateId() {
    return `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
