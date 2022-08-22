module.exports = class Controller {
    showValidationErrors(req, res) {
      const errors = req.validationErrors();
      if (errors) {
        res.status(422).json({
          messages: errors.map((error) => ({
            field: error.param,
            message: error.msg,
          })),
          success: false,
        });
        return true;
      }
      return false;
    }
  
    Ok(res,message,status = 200) {
      return res.status(status).json({
        message: {
          message: message,
          field:null,
        },
        success: true,
      });
    }
  
    Abort(res, status, message = null,field = null) {
      switch (status) {
        case 400:
          res.status(400).json({
            message: {
              message: message || 'Bad Request!',
              field: field ||null,
            },
            success: false,
          });
          break;
        case 401:
          res.status(401).json({
            message: {
              message: message || 'Unauthorized!',
              field: field ||null,
            },
            success: false,
          });
          break;
        case 403:
          res.status(403).json({
            message: {
              message: message || 'Forbidden!',
              field: field ||null,
            },
            success: false,
          });
          break;
        case 404:
          res.status(404).json({
            message: {
              message: message || 'Not Found!',
              field: field ||null,
            },
            success: false,
          });
          break;
        case 500:
          res.status(500).json({
            message: {
              message: message || 'Internal Server Error!',
              field: field ||null,
            },
            success: false,
          });
          break;
        default:
          break;
      }
      return '';
    }
  };
  