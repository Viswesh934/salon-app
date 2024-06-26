const codes = {
    "ok": 200,
    "created": 201,
    "badrequest": 400,
    "unauthorized": 401,
    "forbidden": 403,
    "notfound": 404,
    "conflict": 409,
    "internalerror": 500,
    'mongoerror': 11000,
    'userexists': "User already exists",
    "nouser": "User not found",
    "wrongpass": "Wrong Password",
    "invalidLogin": "Invalid Login",
    "success": "Login Successful",
    "logout": "Logout Successful",
    "blocked": "Slot already booked",
    "slotbooked": "slot booking is successful",
    "expired": "Session Expired"
    
}

module.exports = codes;