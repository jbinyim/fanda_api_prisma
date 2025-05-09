import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const filterSensitiveUserData = (data) => {
  const { encryptedPassword, refreshToken, ...rest } = data;
  return rest;
};

const createUser = async (user) => {
  try {
    const checkUser = await userRepository.findByEmail(user.email);

    if (checkUser) {
      const error = new Error("이미 회원가입을 했습니다.");
      error.code = 422;
      error.data = { email: user.email };
      throw error;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return filterSensitiveUserData(createdUser);
  } catch (e) {
    const error = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    error.code = 500;
    throw error;
  }
};

const getUser = async (email, password) => {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("존재하지 않는 이메일입니다");
      error.code = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) {
      const error = new Error("비밀번호가 일치하지 않습니다");
      error.code = 401;
      throw error;
    }

    return filterSensitiveUserData(user);
  } catch (e) {
    console.log(e);
    const error = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    error.code = 500;
    throw error;
  }
};

const createToken = (user, type) => {
  const payload = { userId: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: type === "refresh" ? "2w" : "1h",
  });

  return token;
};

const updateUser = async (id, data) => {
  const updatedUser = await userRepository.update(id, data);
  return filterSensitiveUserData(updatedUser);
};

const refreshToken = async (userId, refreshToken) => {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  const newAccessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");

  return { newAccessToken, newRefreshToken };
};

export default {
  createUser,
  getUser,
  createToken,
  updateUser,
  refreshToken,
};
