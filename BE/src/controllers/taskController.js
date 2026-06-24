const prisma = require("../dbConfig/prisma");
const {addTask,task} = require("../validation/validation")

exports.createTask = async (req, res) => {
  const userId = req.user.user;
  const result = addTask.safeParse(req.body)
  if (!result.success) {
    return res.json({
      success: false,
      message: "Invalid ",
      errors: result.error.flatten().fieldErrors,
    });
  }

  const { title, description } = result.data;

  await prisma.task.create({
    data: { title, description, user_id: userId },
  });

  res.json({ message: "task added successfully" });
};

exports.getTasks = async (req, res) => {
  const userId = req.user.user;

  const result = task.safeParse(req)
  if (!result.success) {
    return res.status(403).json({message:"Invalid Data"})
  }
  const { query } = task.parse(result.data);

  let { page, limit,search,status } = query;
  page = Number(page);
  limit = Number(limit);

  // console.log(page, limit);

  const where = { user_id: userId };

   if (search) {
     where.OR = [
       { title: { startsWith: search.toLowerCase(),  } },
       { description: { startsWith: search.toLowerCase(), } },
     ];
   }

   if (status) {
     where.status = status;
   }

  const tasks = await prisma.task.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.task.count({ where });
  console.log(total);

  res.json({
    success: true,
    tasks,
    total,
    page,
    limit,
  });
};

exports.getSingleTask = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.user;

  const task = await prisma.task.findFirst({
    where: { id, user_id: userId },
  });

  if (!task) return res.json({ message: "no task found" });

  res.json(task);
};

exports.updateTask = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.user;

  const { title, description } = req.body;

  await prisma.task.updateMany({
    where: { id, user_id: userId },
    data: { title, description },
  });
  res.json({ message: "data updated" });
};

exports.updateStatus = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.user;
  const { status } = req.body;

  await prisma.task.updateMany({
    where: { id, user_id: userId },
    data: { status },
  });

  res.json({ message: "status updated" });
};

exports.deleteTask = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.user;

  await prisma.task.deleteMany({
    where: { id, user_id: userId },
  });

  res.json({ message: "task deleted" });
};
