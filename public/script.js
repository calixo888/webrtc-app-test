const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const peers = {};

myVideo.muted = true;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream) => {
  addVideoStream(myVideo, stream);

  peer.on("call", (call) => {
    call.answer(stream);
    const video = document.createElement("video");

    call.on("stream", (stream) => {
      addVideoStream(video, stream);
    });
  });

  socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream);
  });
});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

const peer = new Peer(undefined, {
  host: "/",
  port: "3001"
});

peer.on("open", (userId) => {
  socket.emit("join-room", ROOM_ID, userId);
});

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (stream) => {
    addVideoStream(video, stream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
