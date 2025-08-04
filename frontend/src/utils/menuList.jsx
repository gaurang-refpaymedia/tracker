export const menuList = [
    {
        id: 0,
        name: "dashboards",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "CRM",
                path: "/",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Analytics",
                path: "/dashboards/analytics",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 1,
        name: "reports",
        path: "#",
        icon: 'feather-cast',
        dropdownMenu: [
            {
                id: 1,
                name: "Sales Report",
                path: "/reports/sales",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Leads Report",
                path: "/reports/leads",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Project Report",
                path: "/reports/project",
                subdropdownMenu: false
            },
            {
                id: 4,
                name: "Timesheets Report",
                path: "/reports/timesheets",
                subdropdownMenu: false
            },

        ]
    }
]
