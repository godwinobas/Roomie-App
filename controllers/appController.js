export const aUser = (req, res, next) => {
  let user;
  user = {
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar,
  };
  res.json({ data: user });
};
