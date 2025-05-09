import prisma from "../db/prisma/client.prisma.js";

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const save = async (user) => {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      encryptedPassword: user.password,
    },
  });
};

const update = async (id, data) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
};

const findById = async (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export default {
  findByEmail,
  save,
  update,
  findById,
};
