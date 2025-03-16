
import User from '../models/UserModel';
const createUser = (newUser: any) =>{
    return new Promise(async (resolve, reject) => {
        const {username,email,password,phone} = newUser;
        try {
            const checkAlreadyEmail = await User.findOne({email: email})
            if(checkAlreadyEmail !== null){
                resolve({
                    status: 'OK',
                    message: 'The email is already in the database'
                })
            }
            const checkAlreadyPhone = await User.findOne({phone: phone})
            if(checkAlreadyPhone !== null){
                resolve({
                    status: 'OK',
                    message: 'The phone is already in the database'
                })
            }
            const checkAlreadyUsername = await User.findOne({username: username})
            if(checkAlreadyUsername !== null){
                resolve({
                    status: 'OK',
                    message: 'The phone is already in the database'
                })
            }
            const createUser = await User.create({
                username,
                password,
                email,
                phone
            })
            if(createUser)
            {
                resolve(
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
module.exports = { createUser };