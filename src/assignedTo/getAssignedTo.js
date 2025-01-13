
const assignedDate = [
    {
        "id": 1,
        "assignedTo": "After Weekly",
    },
    {
        "id": 2,
        "assignedTo": "After 2 Weeks",
    },
    {
        "id": 3,
        "assignedTo": "After Month",
    },
    {
        "id": 4,
        "assignedTo": "After 3 Months",
    },
    {
        "id": 5,
        "assignedTo": "After 5 Months",
    }
]

export default function getAssignedTo(req, res) {
    try {
        return res.status(200).json(assignedDate)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


