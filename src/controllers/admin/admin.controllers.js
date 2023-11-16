import * as Vehicle from "../../services/Vehicle.services.js"

// YYYY-MM-DD HH:MM:SS
const getAdminDashboard = async (req, res) => {
    
    try {
        const currentTime = new Date(new Date());
        currentTime.setHours(currentTime.getHours() + 6);

        const currentDate = new Date();
        currentDate.setHours(6, 0, 0, 0);
        const vehicleLogs = await Vehicle.getVehicleLogs(
            {   
                entryTimeFrom: currentDate,
                entryTimeTo: currentTime,
            }
        );
        res.render('admin/admin.dashboard.ejs', {
        "vehicleLogs": vehicleLogs
        });
    } catch (err) {
        console.error(err);
    }
    
}