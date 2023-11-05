import User from "../../models/User.class.js";
import Vehicle from "../../models/Vehicle.class.js";

const getUserDashboard = async (req, res) => {
    let _mail = req.user.email;
    let user = new User({
        mail : _mail
    });
    await user.fetch();

    const userJson = {
        name: user.name,
        mail: user.mail,
        phoneNumber: user.phoneNumber,
        isStudent: user.isStudent,
        vehicleList: []
    };

    for(let i = 0; i < user.vehicleList.length; i++) {
        let carJson = {
            licenseNumber: user.vehicleList[i].licenseNumber,
            vehicleName: user.vehicleList[i].vehicleName,
            allowedDuration: user.vehicleList[i].allowedDuration,
            approvalStatus: user.vehicleList[i].approvalStatus
        
        };
        userJson['vehicleList'].push(carJson);
    }

    // console.log(userJson);
    res.render('user/user.dashboard.ejs', {"user" : userJson});
}   

const postUserDashboard = async (req, res) => {
    const {licenseNumber, vehicleName} = req.body;
    let vehicle = new Vehicle({
        licenseNumber: licenseNumber,
        userMail : req.user.email,
        vehicleName: vehicleName,
        allowedDuration : 20,
        approvalStatus: false,
    });

    const _mail = req.user.email;
    const user = new User({
        mail : _mail
    });
    await user.fetch();
    try {
        user.addVehicle(vehicle);
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
    }       
}

const removeVehicle = async (req, res) => {
    const { vehicleName, licenseNumber } = req.query;

    // You can now access the values of vehicleName and licenseNumber
    console.log('Removing vehicle with Name:', vehicleName, 'and License Number:', licenseNumber);

    // Implement your removal logic here
    // ...
    const _mail = req.user.email;
    const user = new User({
        mail : _mail
    });
    await user.fetch();

    const vehicle = new Vehicle({
        licenseNumber: licenseNumber,
    });
    await vehicle.fetch();
    try {
        user.removeVehicle(vehicle);
        res.redirect('/dashboard');
    } catch(err) {
        console.log(err);
    }
};


export default {
    getUserDashboard,
    postUserDashboard,
    removeVehicle
}