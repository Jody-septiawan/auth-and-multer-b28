// import model here
const { user } = require('../../models')

// import package here
const joi = require('joi')

exports.register = async (req, res) => {

  const schema = joi.object({
    name: joi.string().min(3).required().messages({
      'string.base': `Nama harus berupa teks`,
      'string.empty': `Nama tidak boleh kosong`,
      'string.min': `Minimal karakter untuk nama harus 3 digit`,
      'any.required': `Nama tidak boleh kosong (required)`
    }),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    status: joi.string().required()
  });

  const { error } = schema.validate(req.body);  

  if(error){
    return res.send({
      error: error.details[0].message
    })
  }

  try {

    const response = await user.create(req.body);

    res.send({
      status: 'success',
      message: 'Register finished',
      data: {
        user: {
          name: response.name,
          email: response.email
        }
      }
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }
};

exports.login = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);

  if(error){
    return res.status(400).send({
      error: {
        message: error.details[0].message
      }
    })
  }

  try {

    const {email, password} = req.body;

    const userExist = await user.findOne({
      where: {
        email
      }
    });

    if(!userExist){
      return res.status(400).send({
        status: 'failed',
        message: 'Email & password not match'
      })
    }

    if(password != userExist.password){
      return res.status(400).send({
        status: 'failed',
        message: 'Email & password not match'
      })
    }

    res.send({
      status: 'success',
      message: 'Login success',
      data: {
        user: {
          name: userExist.name,
          email: userExist.email
        }
      }
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'server error'
    })
  }

};
