//DNS servers use UDP(53) protocol

const dgram = require("node:dgram");
const dnsPacket = require("dns-packet");
const server = dgram.createSocket("udp4");

const db = {
  "google.com": { type: "A", data: "172.217.167.238" },
  "en.wikipedia.com": { type: "CNAME", data: "hashnode.network" },
};

const PORT = 53;

server.on("message", (msg, remoteInfo) => {
  const incomingMessage = dnsPacket.decode(msg);
  const ipFromDb = db[incomingMessage.questions[0].name];

  //Assume IP exists
  const ans = dnsPacket.encode({
    type: "response",
    id: incomingMessage.id,
    flags: dnsPacket.AUTHORITATIVE_ANSWER,
    questions: incomingMessage.questions,
    answers: [
      {
        type: ipFromDb.type,
        class: "IN",
        name: incomingMessage.questions[0].name,
        data: ipFromDb.data,
      },
    ],
  });
  server.send(ans, remoteInfo.port, remoteInfo.address);
});

server.bind(PORT, () => {
  console.log("Server is running on port 53.");
});
