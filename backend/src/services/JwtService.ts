const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const genneralAccessToken = async(payload: any) =>
{
    const accessToken = jwt.sign({
        payload
    },process.env.ACCESS_TOKEN,{expiresIn: '10s'})
    return accessToken;
}
const genneralRefreshToken = async(payload: any) =>
    {
        const refresh_token = jwt.sign(payload,process.env.REFRESH_TOKEN,{expiresIn: '7d'})
        return refresh_token;
    }
const refreshTokenJWTService =(token: any) =>
        {
            return new Promise((resolve, reject) => {
                try{
                    jwt.verify(token,process.env.REFRESH_TOKEN,async(err:any,decoded:any) => {
                        if(err)
                        {
                            resolve(
                            {
                                status: 'error',
                                message: 'Token invalid'
                            })
                        }
                        const {id} = decoded;
                        const new_token = await genneralAccessToken(id)
                        return resolve(
                            {
                                status:'success',
                                message: 'Token refreshed successfully',
                                access_token: new_token
                            }
                        )
                    })
                   
                }
                catch(e)
                {
                    resolve(
                        {
                            status: 'error',
                            message: 'Server error'
                        })
                }
            })
        }
export {genneralAccessToken,genneralRefreshToken,refreshTokenJWTService};