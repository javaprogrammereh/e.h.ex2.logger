module.exports.response = async (res, msg, status, data = null,field=null) => {
    let success = false
    if(status===200 || status===201)success = true
      return res.status(status).json({
          message: {
            field: field,
            message: msg
          },
          status: status,
          success: success,
          data: data || null
        })
  }
  
module.exports.unauthorized = async (res) => {
  return res.status(401).json({
    message: {
      field: "token",
      message: "توکن وارد شده صحیح نیست"
    },
    status: 401,
    success: false,
  });
};