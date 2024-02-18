const venom = require("venom-bot");
const fs = require("fs");
const fsAsync = require("fs/promises");
const MessagesService = require("../../Services/Messages");
const PuppeteerConfigs = require("../../Configs/Puppeteer");
module.exports = new (class {
  constructor() {
    this.connections = [];
  }

  async getExistingConnections() {
    const sessions = await fsAsync.readdir("tokens", { withFileTypes: true });

    return sessions
      .filter((dirent) => dirent.isDirectory())
      .map((s) => s.name.replace("-session", ""));
  }

  getConnectedConnections() {
    return this.connections.filter((c) => c.client);
  }

  async createIfNotConnected(connectionName) {
    const isConnectedAlready = this.getConnectedConnections()
      .map((c) => c.connectionName)
      .includes(connectionName);

    if (!isConnectedAlready) {
      return await this.makeConnection(connectionName);
    }
  }

  async getConnection(connectionName) {
    if (typeof connectionName != "undefined") {
      const results = await this.createIfNotConnected(connectionName);

      if (results) {
        return results;
      }

      return this.getConnectedConnections().filter(
        (c) => c.connectionName == connectionName
      )[0];
    }

    return this.connections;
  }

  async makeConnection(connectionName, connectionOptions) {
    return new Promise((resolve, reject) => {
      const onQr = (base64Qr) => {
        const matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

        const response = {};

        if (matches.length !== 3) {
          return new Error("Invalid input string");
        }

        response.type = matches[1];

        response.data = new Buffer.from(matches[2], "base64");

        const imageBuffer = response;

        const fileName = `${connectionName}-qr.png`;

        const path = `public/storage/${fileName}`;

        fs.writeFile(path, imageBuffer["data"], "binary", (err) => {
          if (err != null) {
            console.log(err);
          }
        });

        resolve({
          connectionName,
          status: "WAITING_FOR_QRSCAN",
          url: process.env.APP_URL + `/render/qr/${fileName}`,
        });
      };

      const options = {
        session: `${connectionName}-session`,
        disableSpins: true,
        disableWelcome: true,
        useChrome: false,
        headless: "new",
        browserPathExecutable: PuppeteerConfigs.executablePath,
        ...(connectionOptions ?? {}),
      };

      const onSessionStatusChange = (sessionStatus) => {
        this.setConnection(connectionName, {
          connectionName,
          status: sessionStatus,
        });
      };

      venom
        .create(options, onQr, onSessionStatusChange)
        .then((client) => {
          const payload = {
            connectionName,
            client,
            status: "CONNECTED",
          };

          this.setConnection(connectionName, payload);

          resolve(payload);
        })
        .catch((err) => reject(err));
    });
  }

  async sendMessage({ connectionName, number, message }) {
    return new Promise(async (resolve, reject) => {
      const connection = await this.getConnection(connectionName);

      if (connection && connection.client) {
        const client = connection.client;

        if (typeof number == "undefined" || typeof message == "undefined") {
          reject("Missing Params");
        }

        try {
          const response = await client.sendText(`${number}@c.us`, message);

          await MessagesService.createMessage({
            type: "SendText",
            body: { message, number, connectionName },
          });

          resolve(response);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  setConnection(connectionName, payload, override) {
    const connectionIndex = this.connections.findIndex(
      (connection) => connection.connectionName == connectionName
    );

    const getPayload = (connection) => {
      return override
        ? payload
        : {
            ...(connection ?? {}),
            ...payload,
          };
    };

    if (connectionIndex != -1) {
      this.connections[connectionIndex] = getPayload(
        this.connections[connectionIndex]
      );
    } else {
      this.connections.push(getPayload());
    }
  }

  async createConnectionInstances() {
    const connections = await this.getExistingConnections();

    connections.forEach(async (connection) => {
      try {
        await this.makeConnection(connection, {
          logQR: false,
          autoClose: 1,
          waitForLogin: true,
        });
      } catch (error) {
        console.log({ error });
      }
    });
  }
})();
