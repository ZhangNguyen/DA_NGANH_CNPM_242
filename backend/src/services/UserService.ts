
import User from '../models/UserModel';
import { genneralAccessToken, genneralRefreshToken } from './JwtService';
const bcrypt = require('bcrypt');
const createUser = (newUser: any) =>{
    return new Promise(async (resolve, reject) => {
        const {username,email,password,phone} = newUser;
        try {
            const checkAlreadyEmail = await User.findOne({email: email})
            if(checkAlreadyEmail !== null){
                return resolve({
                    status: 'OK',
                    message: 'The email is already in the database'
                })
            }
            const checkAlreadyPhone = await User.findOne({phone: phone})
            if(checkAlreadyPhone !== null){
                return resolve({
                    status: 'OK',
                    message: 'The phone is already in the database'
                })
            }
            const passwordhash = bcrypt.hashSync(password,10);
            const createUser = await User.create({
                username,
                password: passwordhash,
                email,
                phone
            })
            if(createUser)
            {
                return resolve(
                    {
                        status: 'success',
                        message: 'User created successfully',
                        data: createUser
                    }
                );
            }
        } catch(e)
        {
            reject(e);
        }
    })
}
const loginUser = (userLogin: any) => {
    return new Promise(async (resolve,reject) =>
    {
        const {email,password} = userLogin;
        try{
            const checkUser = await User.findOne({email:email});
            console.log(checkUser)

            if(!checkUser)
            {
                return resolve(
                    {
                        status: 'Ok',
                        message: 'Email not found'
                    }
                );
            }
            const comparePassword = bcrypt.compareSync(password,checkUser.password);
            if(!comparePassword)
            {
                return resolve({status: 'OK',
                    message: 'Invalid password'
                });
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id
            }); 
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id
            });
            return resolve({
                status: 'success',
                message: 'User logged in successfully',
                access_token
            });
        }
        catch(e)
        {
            reject(e);
        }
    })
}

const getAdaFruitInfo = async(user:any) => {
    return new Promise(async (resolve, reject) => {
    try{
        const result = await User.findOne({ _id: user.payload.id });
        if(!result)
            return resolve(
            {
                status: "Ok",
                message: "No Userfound"
            })
        const adafruit_username = result.adafruit_username;
        const adafruit_key = result.adafruit_key;
        return resolve(
            {
                adafruit_username,
                adafruit_key
            }
        )
    }
    catch(e)
    {
        throw new Error('St wrong');
    }
})
}
const updateAdaFruitInfo = async (user:any,data:any) => {
    return new Promise(async (resolve, reject) => {
    try {
        const userId = user.payload.id; // Lấy user từ middleware decode JWT

        const { adafruit_username, adafruit_key } = data;

        // Kiểm tra dữ liệu đầu vào
        if (!adafruit_username || !adafruit_key) {
            return resolve({
                status: 'error',
                message: 'Adafruit username and key are required'
            });
        }

        // Tìm user và update thông tin Adafruit
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                adafruit_username,
                adafruit_key
            },{ new: true }
        );
        if(!updatedUser) 
        {
            return resolve({
                status: 'error',
                message: 'Fail to update Adafruit'
            });
        }
        return resolve({
            status: 'success',
            message: 'Adafruit info updated successfully',
        });
    }
    catch(error: any)
    {
        reject({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
})
}
module.exports = { createUser,loginUser,getAdaFruitInfo,updateAdaFruitInfo};