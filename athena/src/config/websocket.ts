import { VerifiableCredential } from "@veramo/core";
import { WebSocketServer } from "ws";
import InternalServerError from "../errors/InternalServerError";

/**
 * TODO: Only works on first time, needs to restart server each time
 * Sets up a Websocket the client can connect to. Should be used for sending Verifiable Credential
 * to the client.
 * What happens:
 * 1. Set up connection
 * 2. Server sends VC
 * 3. Client confirms receiving the VC
 * 4. Server closes WebSocket endpoint
 *
 * @param res response sent to client
 * @throws InternalServerError if the process fails
 * @returns A promise that resolves to true if it successfully created endpoint, rejects on error.
 */
const setupWebSocket = async (res: any, vc: VerifiableCredential): Promise<boolean> => {

  return new Promise((resolve, reject) => {
    if (res.socket.server.wss) {
      resolve(true);
    }
  	try {
  		const server = res.socket.server;
  		const wss = new WebSocketServer({ noServer: true });
  		res.socket.server.wss = wss;

  		server.on("upgrade", (req: any, socket: any, head: any) => {
  			if (!req.url.includes("/_next/webpack-hmr")) {
  				wss.handleUpgrade(req, socket, head, (ws) => {
  					wss.emit("connection", ws, req);
  				});
  			}
  		});

  		wss.on("close", () => {
  			res.socket.server = undefined;
  			resolve(true);
  		});

  		wss.on("error", () => {
  			reject(false);
  		})

  		wss.on("connection", (ws) => {
  			ws.send(JSON.stringify(vc));

  			ws.on("message", (data) => {
  				if(data.toString() === "recieved"){
  					wss.close();
  				}
  			});

  		});
  	} catch {
  		throw new InternalServerError('Could not create WebSocket endpoint')
  	}
  })
};

export default setupWebSocket;
