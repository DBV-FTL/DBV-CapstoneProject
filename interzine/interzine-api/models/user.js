const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { BadRequestError, UnauthorizedError, UnprocessableEntityError } = require("../utils/errors");
const { validateFields } = require("../utils/validate");
const validatePassword = require("../utils/validatePassword")

class User {
  static async login(creds) {
    const { email, password } = creds;
    const requiredCreds = ["email", "password"];

    try {
      validateFields({
        required: requiredCreds,
        obj: creds,
        location: "user registration",
      });
    } catch (err) {
      throw err;
    }

    const user = await User.fetchUserByEmail(email);
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const { password, ...userNoPassword } = user;
        return userNoPassword;
      }
    }
    throw new UnauthorizedError("Invalid email/password combo");
  }

  static async register(creds) {
    const { email, username, firstName, lastName, password, zip_code } = creds;
    const requiredCreds = [
      "email",
      "username",
      "firstName",
      "lastName",
      "password",
      'zip_code'
    ];

    try {
      validateFields({
        required: requiredCreds,
        obj: creds,
        location: "user registration",
      });
    } catch (err) {
      throw err;
    }
    if (email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.");
    }

    const existingUserWithEmail = await User.fetchUserByEmail(email);
    if (existingUserWithEmail) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    // if(!validatePassword(password)) throw new UnprocessableEntityError('Password does not satisfy requirements')

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const normalizedEmail = email.toLowerCase();
    
    const result = await db.query(
      `
        INSERT INTO users 
        (first_name, last_name, username, email, password, zip_code) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, email, first_name as "firstName", last_name as "lastName", zip_code
        `,
      [firstName, lastName, username, normalizedEmail, hashedPassword, zip_code]
    );
    const user = result.rows[0];
    return user;
  }

  static async fetchUserByEmail(email) {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email.toLowerCase(),
    ]);

    const user = result.rows[0];
    return user;
  }

  static async fetchUserById(id) {
    const result = await db.query(`SELECT id, first_name, last_name, username, email, zip_code FROM users WHERE id = $1`, [
      id
    ]);

    const user = result.rows[0];
    return user;
  }

  static async fetchProviderByZipCode( {email} ) {
    const result = await db.query(
      `SELECT id, name, cuisine, zip_code, profile_picture, address
       FROM service_providers 
       WHERE zip_code = (SELECT zip_code FROM users WHERE email = $1)`, [email]
    );
    const providers = result.rows;
    return providers;
  }

  static async updateZipCode( {id}, {zip_code}) {
    const result = await db.query(
      `UPDATE users
       SET zip_code = $1
       WHERE users.id = $2
       RETURNING id, email, zip_code`,[zip_code, id])
    const updatedUser = result.rows;
    return updatedUser;
  }
}

module.exports = User;
