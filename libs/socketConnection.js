require("../libs/removeByValue")();

module.exports = io => {
  let userList = [];

  io.on("connection", socket => {
    //아래 두줄로 passport의 req.user의 데이터에 접근한다.
    const session = socket.request.session.passport;
    const user = typeof session !== "undefined" ? session.user : "";

    // userList 필드에 사용자 명이 존재 하지 않으면 삽입
    if (userList.indexOf(user.displayName) === -1) {
      userList.push(user.displayName);
    }
    io.emit("join", userList);

    socket.on("client message", data => {
      io.emit("server message", {
        message: data.message,
        displayname: user.displayName
      });
    });
    socket.on("disconnect", () => {
      userList.removeByValue(user.displayName);
      io.emit("leave", userList);
    });
  });
};
