import User from "../models/UserModel.js";
import Token from "../models/TokenModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
dotenv.config();
const secret = process.env.SECRET;

export function userRegisterPage(req, res){
    res.render("register", {title: "Đăng ký"});
}

export function userLoginPage(req, res){
    res.render("login", {title: "Đăng nhập"});
}

export function userLogoutPage(req, res){
    req.session.destroy();
    res.redirect("/");
}