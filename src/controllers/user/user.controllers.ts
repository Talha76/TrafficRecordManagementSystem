import Database from "../../config/Database.class.js";
import User from "../../models/User.class.js";
import axios from 'axios';
import passport from "passport";

const getLogin = (req, res) => {
    res.send('login');
};

const postLogin = (req, res) => {
    res.send('login');
}


export default {
    getLogin,
    postLogin
}