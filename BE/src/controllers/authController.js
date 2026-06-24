const prisma = require("../dbConfig/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { reg } = require("../validation/validation");
const { success } = require("zod");

// const nodemailer = require("nodemailer");

// const otpStorage = {};
// const attempts = {};
// const verified = {}

// const generateOtp = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();

// exports.sendOtp = async (req, res) => {
//   try {
    
//     const { email } = req.body;
  
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser)
//       return res.status(409).json({ message: "User already exists" });
//     const otp = generateOtp();
//     otpStorage[email] = {otp,expiresAt: Date.now() + 1*60*1000};
//     console.log(otp);
//     console.log(otpStorage);
  
//     verified[email] = false;
//     attempts[email] = 0;
  
//     // setTimeout(() => delete otpStorage[email], 1 * 60 * 1000);
  
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
      
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
  
//     transporter.verify((err, success) => {
//       if(err) console.log("smpt error",err);
//       else console.log("smpt connected");
      
      
//     })
//     const mailOption = {
//       from: `${process.env.EMAIL_USER}`,
//       to: email,
//       subject: "Your OTP",
//       html: `<h1>${otp}</h1>`,
//     };
  
//     await transporter.sendMail(mailOption);
//     res.json({ message: "OTP sent" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({message:"error sending otp"})
    
//   }
// };

// exports.verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   if (!otpStorage[email])
//     return res.status(400).json({message:'ot expiered or not sent'})

//   if (Date.now() > otpStorage[email].expiresAt) {
//     delete otpStorage[email]
//     return res.status(400).json({message:'otp expiered'})
//   }

//   if (otpStorage[email].otp != otp)
//     return res.status(400).json({message:'Invalid otp'})
  
//   verified[email] = true;
//   delete otpStorage[email]

//   return res.json({ message: "otp verified" });
// };

exports.register = async (req, res) => {
  const validatedData = reg.safeParse(req.body);

  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: "validation falied",
      errors: validatedData.error.flatten().fieldErrors,
    });
  }

  const { name, email, password, country, state, city } = validatedData.data;

  // if (!verified[email])
  //   return res.status(400).json({message:"email not verified."})

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(409).json({ message: "User already exists" });

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) return res.status(403).json({ message: err });

    const user = await prisma.user.create({
      data: {
        uname: name,
        email,
        password: hash,
        country,
        state,
        city,
        role: "user",
      },
    });

    const token = jwt.sign(
      { user: user.id, role: "user" },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );


    // delete verified[email]

    res.json({
      success: true,
      message: "Register success",
      token,
      role: "user",
    });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { user: user.id, role: user.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ message: "Login success", token, role: user.role, user });
};

exports.forgotPwd = async (req, res) => {
  console.log(req.body, "fp");

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "no mail id registered" });

  bcrypt.hash(password, 10, async (err, hash) => {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });

    return res.json({ message: "password reset successfully" });
  });
};
