export const Menu = [
    {
        id: "can_access_super_admin_dashboard",
        title: "Super Admin",
        icon: "fa fa-dashboard",
        pathname: "/pages/super admin dashboard/",
        item: null,
    },
    {
        id: "can_access_admin_dashboard",
        title: "Admin Dashboard",
        icon: "fa fa-dashboard",
        pathname: "/pages/admin dashboard/",
        item: null,
    },
    {
        id: "can_access_hr_dashboard",
        title: "HR Dashboard",
        icon: "fa fa-dashboard",
        pathname: "/pages/hr dashboard/",
        item: null,
    },
    {
        id: "can_access_inventory_dashboard",
        title: "Inventory Dashboard",
        icon: "fa fa-dashboard",
        pathname: "/pages/inventory dashboard/",
        item: null,
    },
    {
        id: "can_access_employee_dashboard",
        title: "Employee Dashboard",
        icon: "fa fa-dashboard",
        pathname: "/pages/employee dashboard/",
        item: null,
    },
    {
        id: "can_access_department",
        title: "Directory",
        icon: "fa fa-building",
        toggleIcon: "fa fa-angle-left",
        dropdownID: "dropdown-2",
        item:[
            {
                id: "can_view_department",
                title: "Departments",
                pathname: "/pages/department/departments/",
            },
            {
                id: "can_view_position",
                title: "Positions",
                pathname: "/pages/department/positions/",
            },
        ],
    },
    {
        id: "can_view_my_profile",
        title: "My Profile",
        icon: "fa fa-user-circle",    
        pathname: "/pages/my profile/",
        item: null,
    },
    {
        id: "can_view_attendance",
        title: "Attendance",
        icon: "fas fa-user-clock",    
        pathname: "/pages/attendance/",
        item: null,
    },
    {
        id: "can_view_leave",
        title: "Leave",
        icon: "fas fa-calendar-times",    
        pathname: "/pages/leave/",
        item: null,
    },
    {
        id: "can_view_benefit",
        title: "Benefits",
        icon: "fas fa-hand-holding-usd",    
        pathname: "/pages/benefits/",
        item: null,
    },
    {
        id: "can_access_employee",
        title: "Employee",
        icon: "fa fa-users",
        toggleIcon: "fa fa-angle-left",
        dropdownID: "dropdown-4",
        item:[
            {   
                id: "can_view_employee",
                title: "Employees",
                pathname: "/pages/employee/employees/",
            },
            {
                id: "can_view_employee_attendance",
                title: "Attendance",
                pathname: "/pages/employee/attendance/",
            },
            {
                id: "can_view_employee_leave",
                title: "Leave",
                pathname: "/pages/employee/leave/",
            },
            {
                id: "can_view_employee_benefit",
                title: "Benefits",
                pathname: "/pages/employee/benefits/",
            },
        ],
    },
    {
        id: "can_view_user",
        icon: "fa fa-user",
        title: "Users",
        pathname: "/pages/users/",
    },
    {
        id: "can_access_inventory",
        title: "Inventory",
        icon: "fa fa-cubes",
        toggleIcon: "fa fa-angle-left",
        dropdownID: "dropdown-6",
        item:[
            {
                id: "can_view_office_supply",
                title: "Office Supply",
                pathname: "/pages/inventory/office supply/",
            },
            {
                id: "can_view_equipment",
                title: "Equipment",
                pathname: "/pages/inventory/equipment/",
            },
        ],
    },
    {
        id: "can_access_file",
        title: "File",
        icon: "fa fa-folder",
        toggleIcon: "fa fa-angle-left",
        dropdownID: "dropdown-7",
        item:[
            {
                id: "can_view_file",
                title: "My Files",
                pathname: "/pages/file/my files/",
            },
            {
                id: "can_view_department_file",
                title: "Department Files",
                pathname: "/pages/file/department files/",
            },
        ],
    },
    {
        id: "can_access_history",
        title: "History",
        icon: "fa fa-history",
        toggleIcon: "fa fa-angle-left",
        dropdownID: "dropdown-8",
        item:[
            {
                id: "can_view_login_history",
                title: "Login History",
                pathname: "/pages/history/login history/",
            },
            {
                id: "can_view_user_activity",
                title: "User Activity",
                pathname: "/pages/history/user activities/",
            },
        ],
    },
    {
        id: "can_access_report",
        title: "Report",
        icon: "fa fa-file-text",
        pathname: "/pages/reports/",
        item: null,
    },
    {
        id: "can_access_hr_settings",
        title: "Settings",
        icon: "fa fa-gear",
        pathname: "/pages/hr settings/",
        item: null
    },
    {
        id: "can_access_inventory_settings",
        title: "Settings",
        icon: "fa fa-gear",
        pathname: "/pages/inventory settings/",
        item: null
    },
    {
        id: "can_access_user_settings",
        title: "Settings",
        icon: "fa fa-gear",
        pathname: "/pages/user settings/",
        item: null
    },
]



export const Sexes = [
    { value: "Male" , name: "Male"},
    { value: "Female" , name: "Female"},
];

export const NameExtensions = [
    { value: "Jr." , name: "Jr."},
    { value: "Sr." , name: "Sr"},
];

export const BloodTypes = [
    { value: "O+", name: "O+"},
    { value: "O-", name: "O-"},
    { value: "A+", name: "A+"},
    { value: "A-", name: "A-"},
    { value: "B+", name: "B+"},
    { value: "B-", name: "B-"},
    { value: "AB-", name: "AB-"},
    { value: "AB+", name: "AB+"},
];

export const EmployeeTypes = [
    { value: "Regular", name: "Regular"},
    { value: "Conctractual", name: "Conctractual"},
];