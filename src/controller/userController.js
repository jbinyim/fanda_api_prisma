import userService from "../service/userService.js";

const createUser = async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;

    if (!email || !nickname || !password) {
      const error = new Error("이메일, 닉네임, 비밀번호가 모두 필요합니다.");
      error.code = 422;
      throw error;
    }

    const user = await userService.createUser({
      email,
      nickname,
      password,
    });

    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("이메일, 비밀번호 모두 필요합니다");
      error.code = 422;
      throw error;
    }
    const user = await userService.getUser(email, password);

    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");

    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameTitle: "none",
      secure: true,
    });
    res.status(201).json({ ...user, accessToken });
  } catch (e) {
    next(e);
  }
};

const verifyAndRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth;

    const { newAccessToken, newRefreshToken } = await userService.refreshToken(
      userId,
      refreshToken
    );

    await userService.updateUser(userId, { refreshToken: newRefreshToken });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameTitle: "none",
      secure: true,
      path: "/token/refresh",
    });

    res.status(201).json({ accessToken: newAccessToken });
  } catch (e) {
    next(e);
  }
};

export default {
  createUser,
  getUser,
  verifyAndRefreshToken,
};
